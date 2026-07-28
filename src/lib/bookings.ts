import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase";
import type { Booking, Notification, Slot } from "@/lib/types";

function mapSlot(id: string, data: Record<string, unknown>): Slot {
  return {
    id,
    date: String(data.date ?? ""),
    time: String(data.time ?? ""),
    isBooked: Boolean(data.isBooked),
  };
}

function mapBooking(id: string, data: Record<string, unknown>): Booking {
  return {
    id,
    userId: String(data.userId ?? ""),
    userName: String(data.userName ?? ""),
    userPhone: String(data.userPhone ?? ""),
    date: String(data.date ?? ""),
    timeSlot: String(data.timeSlot ?? ""),
    slotId: String(data.slotId ?? ""),
    amount: Number(data.amount ?? 0),
    screenshotUrl: String(data.screenshotUrl ?? ""),
    status: (data.status as Booking["status"]) ?? "pending",
    meetLink: data.meetLink ? String(data.meetLink) : undefined,
    serviceName: data.serviceName ? String(data.serviceName) : undefined,
    birthName: data.birthName ? String(data.birthName) : undefined,
    dob: data.dob ? String(data.dob) : undefined,
    birthPlace: data.birthPlace ? String(data.birthPlace) : undefined,
    birthTime: data.birthTime ? String(data.birthTime) : undefined,
    // Match Horoscope — bride
    brideName: data.brideName ? String(data.brideName) : undefined,
    brideAge: data.brideAge ? String(data.brideAge) : undefined,
    brideDob: data.brideDob ? String(data.brideDob) : undefined,
    brideBirthPlace: data.brideBirthPlace ? String(data.brideBirthPlace) : undefined,
    brideBirthTime: data.brideBirthTime ? String(data.brideBirthTime) : undefined,
    // Match Horoscope — groom
    groomName: data.groomName ? String(data.groomName) : undefined,
    groomAge: data.groomAge ? String(data.groomAge) : undefined,
    groomDob: data.groomDob ? String(data.groomDob) : undefined,
    groomBirthPlace: data.groomBirthPlace ? String(data.groomBirthPlace) : undefined,
    groomBirthTime: data.groomBirthTime ? String(data.groomBirthTime) : undefined,
    note: data.note ? String(data.note) : undefined,
    createdAt: (data.createdAt as { toMillis?: () => number })?.toMillis?.() ?? Date.now(),
  };
}

export function subscribeSlots(cb: (slots: Slot[]) => void): Unsubscribe {
  const q = query(collection(getFirebaseDb(), "slots"), orderBy("date"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapSlot(d.id, d.data())));
  });
}

export async function addSlots(date: string, times: string[]) {
  const db = getFirebaseDb();
  const existing = await getDocs(
    query(collection(db, "slots"), where("date", "==", date))
  );
  const existingTimes = new Set(existing.docs.map((d) => d.data().time));
  const toAdd = times.filter((t) => !existingTimes.has(t));
  await Promise.all(
    toAdd.map((time) =>
      addDoc(collection(db, "slots"), {
        date,
        time,
        isBooked: false,
        createdAt: serverTimestamp(),
      })
    )
  );
  return toAdd.length;
}

export async function deleteSlot(slotId: string) {
  await deleteDoc(doc(getFirebaseDb(), "slots", slotId));
}

export async function toggleSlotBooked(slotId: string, isBooked: boolean) {
  await updateDoc(doc(getFirebaseDb(), "slots", slotId), { isBooked });
}

export function subscribeUserBookings(
  userId: string,
  cb: (bookings: Booking[]) => void
): Unsubscribe {
  // Equality-only query — sort client-side so no composite index is required
  const q = query(
    collection(getFirebaseDb(), "bookings"),
    where("userId", "==", userId)
  );
  return onSnapshot(
    q,
    (snap) => {
      const bookings = snap.docs
        .map((d) => mapBooking(d.id, d.data()))
        .sort((a, b) => b.createdAt - a.createdAt);
      cb(bookings);
    },
    (err) => {
      console.error("subscribeUserBookings:", err);
      cb([]);
    }
  );
}

export function subscribeAllBookings(cb: (bookings: Booking[]) => void): Unsubscribe {
  const q = query(collection(getFirebaseDb(), "bookings"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapBooking(d.id, d.data())));
  });
}

export async function uploadPaymentScreenshot(userId: string, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const mime =
    file.type && file.type.startsWith("image/")
      ? file.type
      : ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg";

  const path = `payment-screenshots/${userId}/${Date.now()}.${ext === "jpeg" ? "jpg" : ext}`;
  const storageRef = ref(getFirebaseStorage(), path);

  await uploadBytes(storageRef, file, {
    contentType: mime,
    customMetadata: { originalName: file.name.slice(0, 80) },
  });

  return getDownloadURL(storageRef);
}

export async function createBooking(input: {
  userId: string;
  userName: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  slotId: string;
  amount: number;
  screenshotUrl: string;
}) {
  const db = getFirebaseDb();
  const bookingRef = await addDoc(collection(db, "bookings"), {
    ...input,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  try {
    await updateDoc(doc(db, "slots", input.slotId), { isBooked: true });
  } catch (err) {
    console.error("Failed to mark slot booked:", err);
    throw err;
  }

  try {
    await addDoc(collection(db, "notifications"), {
      type: "new_booking",
      bookingId: bookingRef.id,
      userName: input.userName,
      date: input.date,
      timeSlot: input.timeSlot,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }

  return bookingRef.id;
}

/** Service request with birth details and optional consultation slot. */
export async function createServiceBooking(input: {
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  screenshotUrl: string;
  serviceName: string;
  birthName: string;
  dob: string;
  birthPlace: string;
  birthTime: string;
  consultationDate?: string;
  consultationTime?: string;
  slotId?: string;
  note?: string;
}) {
  const db = getFirebaseDb();
  const meetingDate = input.consultationDate || input.dob;
  const meetingTime = input.consultationTime || input.birthTime;

  if (input.slotId) {
    await updateDoc(doc(db, "slots", input.slotId), {
      isBooked: true,
      bookedBy: input.userId,
      userName: input.userName,
    });
  }

  const bookingRef = await addDoc(collection(db, "bookings"), {
    userId: input.userId,
    userName: input.userName,
    userPhone: input.userPhone,
    date: meetingDate,
    timeSlot: meetingTime,
    slotId: input.slotId || "",
    amount: input.amount,
    screenshotUrl: input.screenshotUrl,
    serviceName: input.serviceName,
    birthName: input.birthName,
    dob: input.dob,
    birthPlace: input.birthPlace,
    birthTime: input.birthTime,
    ...(input.note ? { note: input.note } : {}),
    status: "pending",
    createdAt: serverTimestamp(),
  });

  try {
    await addDoc(collection(db, "notifications"), {
      type: "new_booking",
      bookingId: bookingRef.id,
      userName: input.userName,
      date: meetingDate,
      timeSlot: `${input.serviceName} · ${meetingTime}`,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }

  return bookingRef.id;
}

/** Match Horoscope request — stores bride + groom details and optional consultation slot. */
export async function createMatchHoroscopeBooking(input: {
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  screenshotUrl: string;
  brideName: string;
  brideAge: string;
  brideDob: string;
  brideBirthPlace: string;
  brideBirthTime: string;
  groomName: string;
  groomAge: string;
  groomDob: string;
  groomBirthPlace: string;
  groomBirthTime: string;
  consultationDate?: string;
  consultationTime?: string;
  slotId?: string;
  note?: string;
}) {
  const db = getFirebaseDb();
  const meetingDate = input.consultationDate || input.brideDob;
  const meetingTime = input.consultationTime || input.brideBirthTime;

  if (input.slotId) {
    await updateDoc(doc(db, "slots", input.slotId), {
      isBooked: true,
      bookedBy: input.userId,
      userName: input.userName,
    });
  }

  const bookingRef = await addDoc(collection(db, "bookings"), {
    userId: input.userId,
    userName: input.userName,
    userPhone: input.userPhone,
    date: meetingDate,
    timeSlot: meetingTime,
    slotId: input.slotId || "",
    amount: input.amount,
    screenshotUrl: input.screenshotUrl,
    serviceName: "Match Horoscope",
    brideName: input.brideName,
    brideAge: input.brideAge,
    brideDob: input.brideDob,
    brideBirthPlace: input.brideBirthPlace,
    brideBirthTime: input.brideBirthTime,
    groomName: input.groomName,
    groomAge: input.groomAge,
    groomDob: input.groomDob,
    groomBirthPlace: input.groomBirthPlace,
    groomBirthTime: input.groomBirthTime,
    ...(input.note ? { note: input.note } : {}),
    status: "pending",
    createdAt: serverTimestamp(),
  });

  try {
    await addDoc(collection(db, "notifications"), {
      type: "new_booking",
      bookingId: bookingRef.id,
      userName: input.userName,
      date: input.brideDob,
      timeSlot: `Match Horoscope · ${input.brideName} & ${input.groomName}`,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }

  return bookingRef.id;
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"],
  slotId?: string
) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "bookings", bookingId), { status });
  if (status === "rejected" && slotId) {
    await updateDoc(doc(db, "slots", slotId), { isBooked: false });
  }
}

export async function updateBookingMeetLink(bookingId: string, meetLink: string) {
  const trimmed = meetLink.trim();
  await updateDoc(doc(getFirebaseDb(), "bookings", bookingId), {
    meetLink: trimmed,
  });
}

export function subscribeNotifications(
  cb: (items: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), "notifications"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          type: "new_booking" as const,
          bookingId: String(data.bookingId ?? ""),
          userName: String(data.userName ?? ""),
          date: String(data.date ?? ""),
          timeSlot: String(data.timeSlot ?? ""),
          read: Boolean(data.read),
          createdAt:
            data.createdAt?.toMillis?.() ?? Date.now(),
        };
      })
    );
  });
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(getFirebaseDb(), "notifications", id), { read: true });
}
