"use client";

import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { updateUserProfile as saveUserProfile } from "@/lib/users";
import type { AppUser } from "@/lib/types";

interface AuthState {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  initialized: boolean;
  init: () => () => void;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileInfo: (data: {
    name: string;
    phone: string;
    city: string;
  }) => Promise<void>;
}

async function fetchProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    city: String(data.city ?? ""),
    role: (data.role as AppUser["role"]) ?? "user",
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

async function writeUserProfile(
  uid: string,
  data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    role?: AppUser["role"];
    includeCreatedAt?: boolean;
  }
) {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    city: data.city,
    role: data.role ?? "user",
  };
  if (data.includeCreatedAt) {
    payload.createdAt = serverTimestamp();
  }
  await setDoc(doc(getFirebaseDb(), "users", uid), payload, { merge: true });
}

async function ensureUserProfile(
  user: User,
  extras?: { phone?: string; city?: string; name?: string }
): Promise<AppUser> {
  const existing = await fetchProfile(user.uid);

  const name = (extras?.name || existing?.name || user.displayName || "User").trim();
  const email = existing?.email || user.email || "";
  const phone = (extras?.phone || existing?.phone || "").trim();
  const city = (extras?.city || existing?.city || "").trim();
  const role = existing?.role ?? "user";

  // Race fix: auth listener may create an empty doc before signup writes phone/city.
  // Always merge when we have extras, or when the doc is missing.
  const needsWrite =
    !existing ||
    Boolean(extras) ||
    (!existing.phone && phone) ||
    (!existing.city && city) ||
    (!existing.name && name);

  if (needsWrite) {
    await writeUserProfile(user.uid, {
      name,
      email,
      phone,
      city,
      role,
      includeCreatedAt: !existing,
    });
  }

  return {
    uid: user.uid,
    name,
    email,
    phone,
    city,
    role,
    createdAt: existing?.createdAt ?? Date.now(),
  };
}

function firestoreMissingError(err: unknown): Error | null {
  const msg = err instanceof Error ? err.message : String(err);
  if (
    msg.includes("not found") ||
    msg.includes("(default)") ||
    /database ['`]?astrodata/i.test(msg)
  ) {
    return new Error(
      "Firestore database 'astrodata' missing. Create it in Firebase Console → Firestore → Database ID: astrodata, then publish firestore.rules."
    );
  }
  return null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  init: () => {
    if (!isFirebaseConfigured()) {
      set({ loading: false, initialized: true, user: null, profile: null });
      return () => undefined;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ user: null, profile: null, loading: false, initialized: true });
        return;
      }
      try {
        const profile = await ensureUserProfile(user);
        set({ user, profile, loading: false, initialized: true });
      } catch {
        set({ user, profile: null, loading: false, initialized: true });
      }
    });
    return unsub;
  },

  signup: async ({ name, email, phone, city, password }) => {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    try {
      // Write phone/city immediately with merge so the auth-state race cannot wipe them
      await writeUserProfile(cred.user.uid, {
        name: name.trim(),
        email: cred.user.email || email,
        phone: phone.trim(),
        city: city.trim(),
        role: "user",
        includeCreatedAt: true,
      });
      const profile = await ensureUserProfile(cred.user, { name, phone, city });
      set({ user: cred.user, profile, loading: false, initialized: true });
    } catch (err: unknown) {
      throw firestoreMissingError(err) ?? err;
    }
  },

  login: async (email, password) => {
    const auth = getFirebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    try {
      const profile = await ensureUserProfile(cred.user);
      set({ user: cred.user, profile, loading: false, initialized: true });
    } catch (err: unknown) {
      throw firestoreMissingError(err) ?? err;
    }
  },

  logout: async () => {
    await signOut(getFirebaseAuth());
    set({ user: null, profile: null });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await fetchProfile(user.uid);
    set({ profile });
  },

  updateProfileInfo: async ({ name, phone, city }) => {
    const { user, profile } = get();
    if (!user || !profile) throw new Error("Not signed in");
    const saved = await saveUserProfile(user.uid, { name, phone, city });
    await updateProfile(user, { displayName: saved.name });
    set({
      profile: {
        ...profile,
        name: saved.name,
        phone: saved.phone,
        city: saved.city,
      },
    });
  },
}));
