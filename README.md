# Astro Bodh — Astrology Consultation Booking

Full-stack booking platform built with **Next.js (App Router)**, **Firebase Auth / Firestore / Storage**, and **Framer Motion**.

## Features

- Public landing page (hero, services, about, contact)
- Email/password signup & login with role-based access (`user` | `admin`)
- User dashboard: slot booking, UPI payment screenshot upload, live booking status, chat (after confirmation)
- Admin dashboard: slot management, users list, notifications, accept/reject bookings, chat inbox
- Real-time updates via Firestore `onSnapshot`

## Setup

### 1. Install & run

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 2. Firebase project

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication → Email/Password**
3. Create **Firestore** and **Storage**
4. Copy web app config into `.env.local`
5. Deploy rules:

```bash
firebase deploy --only firestore:rules,storage
```

Or paste `firestore.rules` and `storage.rules` in the Firebase Console.

### 3. Create an admin user

1. Sign up normally through the app
2. In Firestore, open `users/{uid}` and set `role` to `"admin"`
3. Log out and log back in → redirect to `/admin`

### 4. Payment display

Set in `.env.local`:

- `NEXT_PUBLIC_UPI_ID`
- `NEXT_PUBLIC_CONSULTATION_FEE`
- `NEXT_PUBLIC_QR_CODE_URL` (default: `/payment-qr.svg` — replace with your real QR image in `/public`)

## Firestore indexes

If Firestore prompts for composite indexes (e.g. `bookings` by `userId` + `createdAt`), click the link in the browser console error to create them.

## Scripts

| Command       | Description        |
|---------------|--------------------|
| `npm run dev` | Local development  |
| `npm run build` | Production build |
| `npm start`   | Run production     |

## Project structure

```
src/
  app/           # Routes: /, /login, /signup, /dashboard, /admin
  components/    # UI, landing, auth, dashboard, admin, chat
  lib/           # Firebase, types, booking/chat helpers
  store/         # Zustand auth store
```
