import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase";
import type { ChatMessage, ChatType, UserRole } from "@/lib/types";

export type ChatListItem = {
  bookingId: string;
  userId: string;
  userName: string;
  chatType: ChatType;
  lastMessage: string;
  lastMessageAt: number;
  unreadByAdmin: number;
  unreadByUser: number;
};

/** One support thread per user — Help & Support FAB */
export function supportChatId(userId: string) {
  return `support_${userId}`;
}

/** One paid consultation thread per user */
export function paidChatId(userId: string) {
  return `paid_${userId}`;
}

export function resolveChatType(
  chatId: string,
  data?: { chatType?: string; userId?: string }
): ChatType {
  if (data?.chatType === "paid" || data?.chatType === "support") {
    return data.chatType;
  }
  if (chatId.startsWith("paid_")) return "paid";
  if (chatId.startsWith("support_")) return "support";
  // Legacy free chats used raw userId as doc id
  if (data?.userId && chatId === data.userId) return "support";
  return "paid";
}

function mapMessage(id: string, data: Record<string, unknown>): ChatMessage {
  return {
    id,
    senderId: String(data.senderId ?? ""),
    senderRole: (data.senderRole as UserRole) ?? "user",
    senderName: String(data.senderName ?? ""),
    text: String(data.text ?? ""),
    imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
    createdAt:
      (data.createdAt as { toMillis?: () => number })?.toMillis?.() ?? Date.now(),
  };
}

export function subscribeMessages(
  bookingId: string,
  cb: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), "chats", bookingId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapMessage(d.id, d.data())));
  });
}

export async function uploadChatImage(bookingId: string, file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be under 5 MB");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
    ? ext === "jpeg"
      ? "jpg"
      : ext
    : "jpg";
  const mime =
    file.type && file.type.startsWith("image/")
      ? file.type
      : safeExt === "png"
        ? "image/png"
        : safeExt === "webp"
          ? "image/webp"
          : safeExt === "gif"
            ? "image/gif"
            : "image/jpeg";

  const path = `chat-images/${bookingId}/${Date.now()}.${safeExt}`;
  const storageRef = ref(getFirebaseStorage(), path);
  await uploadBytes(storageRef, file, {
    contentType: mime,
    customMetadata: { originalName: file.name.slice(0, 80) },
  });
  return getDownloadURL(storageRef);
}

export async function sendMessage(input: {
  bookingId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  imageUrl?: string;
  userId: string;
  userName: string;
  chatType: ChatType;
}) {
  const db = getFirebaseDb();
  const {
    bookingId,
    text,
    imageUrl,
    senderId,
    senderRole,
    senderName,
    userId,
    userName,
    chatType,
  } = input;

  const trimmed = text.trim();
  if (!trimmed && !imageUrl) {
    throw new Error("Message cannot be empty");
  }

  const preview = trimmed ? trimmed.slice(0, 80) : "📷 Photo";

  const chatMeta = {
    bookingId,
    userId,
    userName,
    chatType,
    lastMessage: preview,
    lastMessageAt: Date.now(),
    unreadByAdmin: senderRole === "user" ? 1 : 0,
    unreadByUser: senderRole === "admin" ? 1 : 0,
  };

  await setDoc(doc(db, "chats", bookingId), chatMeta, { merge: true });

  await addDoc(collection(db, "chats", bookingId, "messages"), {
    senderId,
    senderRole,
    senderName,
    text: trimmed,
    ...(imageUrl ? { imageUrl } : {}),
    createdAt: serverTimestamp(),
  });
}

export function subscribeChatList(
  cb: (chats: ChatListItem[]) => void,
  filterType?: ChatType
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), "chats"),
    orderBy("lastMessageAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => {
      const data = d.data();
      const userId = String(data.userId ?? "");
      return {
        bookingId: d.id,
        userId,
        userName: String(data.userName ?? ""),
        chatType: resolveChatType(d.id, {
          chatType: data.chatType as string | undefined,
          userId,
        }),
        lastMessage: String(data.lastMessage ?? ""),
        lastMessageAt: Number(data.lastMessageAt ?? 0),
        unreadByAdmin: Number(data.unreadByAdmin ?? 0),
        unreadByUser: Number(data.unreadByUser ?? 0),
      };
    });
    cb(filterType ? items.filter((c) => c.chatType === filterType) : items);
  });
}

export async function clearUnread(bookingId: string, role: UserRole) {
  const field = role === "admin" ? "unreadByAdmin" : "unreadByUser";
  await updateDoc(doc(getFirebaseDb(), "chats", bookingId), { [field]: 0 });
}
