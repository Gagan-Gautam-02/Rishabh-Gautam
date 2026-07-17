import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { AppUser } from "@/lib/types";

export function subscribeUsers(cb: (users: AppUser[]) => void): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), "users"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          name: String(data.name ?? ""),
          email: String(data.email ?? ""),
          phone: String(data.phone ?? ""),
          city: String(data.city ?? ""),
          role: (data.role as AppUser["role"]) ?? "user",
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        };
      })
    );
  });
}

export async function updateUserProfile(
  uid: string,
  data: { name: string; phone: string; city: string }
) {
  const name = data.name.trim();
  const phone = data.phone.trim();
  const city = data.city.trim();
  if (!name) throw new Error("Name required");
  if (phone.replace(/\D/g, "").length < 10) {
    throw new Error("Valid phone required");
  }
  if (!city) throw new Error("City required");

  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    name,
    phone,
    city,
  });

  return { name, phone, city };
}
