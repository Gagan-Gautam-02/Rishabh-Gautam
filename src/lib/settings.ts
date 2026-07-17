import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { CONSULTATION_FEE } from "@/lib/constants";
import { getFirebaseDb } from "@/lib/firebase";

const SETTINGS_DOC = "consultation";

export function subscribeConsultationFee(
  callback: (fee: number) => void
): Unsubscribe {
  return onSnapshot(
    doc(getFirebaseDb(), "settings", SETTINGS_DOC),
    (snapshot) => {
      const fee = Number(snapshot.data()?.fee);
      callback(Number.isFinite(fee) && fee > 0 ? fee : CONSULTATION_FEE);
    },
    (error) => {
      console.error("subscribeConsultationFee:", error);
      callback(CONSULTATION_FEE);
    }
  );
}

export async function updateConsultationFee(fee: number) {
  if (!Number.isInteger(fee) || fee < 1 || fee > 1_000_000) {
    throw new Error("Fee must be a whole number between ₹1 and ₹10,00,000");
  }

  await setDoc(
    doc(getFirebaseDb(), "settings", SETTINGS_DOC),
    {
      fee,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
