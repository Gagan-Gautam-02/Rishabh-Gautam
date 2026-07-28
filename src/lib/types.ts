export type UserRole = "user" | "admin";
export type BookingStatus = "pending" | "confirmed" | "rejected";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  createdAt: number;
}

export interface Slot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  isBooked: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  slotId: string;
  amount: number;
  screenshotUrl: string;
  status: BookingStatus;
  meetLink?: string;
  /** Service directory request (optional for slot-only bookings) */
  serviceName?: string;
  birthName?: string;
  dob?: string;
  birthPlace?: string;
  birthTime?: string;
  /** Match Horoscope — bride details */
  brideName?: string;
  brideAge?: string;
  brideDob?: string;
  brideBirthPlace?: string;
  brideBirthTime?: string;
  /** Match Horoscope — groom details */
  groomName?: string;
  groomAge?: string;
  groomDob?: string;
  groomBirthPlace?: string;
  groomBirthTime?: string;
  /** Optional user note / special question */
  note?: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  type: "new_booking";
  bookingId: string;
  userName: string;
  date: string;
  timeSlot: string;
  read: boolean;
  createdAt: number;
}

export type ChatType = "support" | "paid";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  imageUrl?: string;
  createdAt: number;
}

export interface ChatMeta {
  bookingId: string;
  userId: string;
  userName: string;
  chatType: ChatType;
  lastMessage: string;
  lastMessageAt: number;
  unreadByAdmin: number;
  unreadByUser: number;
}
