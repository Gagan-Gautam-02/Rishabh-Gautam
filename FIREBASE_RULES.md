# Firebase Security — Auth, Firestore, Realtime Database

This app uses **Firestore** (+ Storage) as the main backend.  
Realtime Database rules are included because your Firebase project has RTDB enabled.

---

## 1. Firebase Authentication

Auth has **no rules file**. Configure it in the Console:

### Enable providers
**Authentication → Sign-in method**
- ✅ Email/Password
- (Optional) Phone

### Recommended settings
**Authentication → Settings**
- Authorized domains: `localhost`, your Vercel domain, `rishabhgautam-8744a.firebaseapp.com`
- Email enumeration protection: ON (if available)

### Role security (important)
Never let clients set themselves as admin.

1. User signs up → app writes `users/{uid}` with `role: "user"`
2. You manually set `role: "admin"` in Firestore Console for your account
3. Firestore rules block changing `role` unless requester is already admin

### Optional: block unauthorized signups
Use **Blocking functions** (Cloud Functions) if you want to restrict who can register. Not required for MVP.

---

## 2. Firestore Rules

Paste into **Firestore → Rules** (or use `firestore.rules`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    function userDoc() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function isAdmin() {
      return isSignedIn() && userDoc().role == 'admin';
    }

    match /users/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid)
        && request.resource.data.role == 'user'
        && request.resource.data.email == request.auth.token.email;
      allow update: if (isOwner(uid)
          && request.resource.data.role == resource.data.role)
        || isAdmin();
      allow delete: if isAdmin();
    }

    match /slots/{slotId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /bookings/{bookingId} {
      allow read: if isSignedIn()
        && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isSignedIn()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.status == 'pending';
      allow update: if isAdmin()
        || (isSignedIn()
          && resource.data.userId == request.auth.uid
          && request.resource.data.diff(resource.data).affectedKeys()
              .hasOnly(['screenshotUrl']));
      allow delete: if isAdmin();
    }

    match /notifications/{id} {
      allow read: if isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    match /chats/{bookingId} {
      allow read, write: if isSignedIn() && (
        isAdmin()
        || get(/databases/$(database)/documents/bookings/$(bookingId)).data.userId
            == request.auth.uid
      );

      match /messages/{msgId} {
        allow read, create: if isSignedIn() && (
          isAdmin()
          || get(/databases/$(database)/documents/bookings/$(bookingId)).data.userId
              == request.auth.uid
        );
        allow update, delete: if false;
      }
    }
  }
}
```

Click **Publish**.

---

## 3. Realtime Database Rules

Paste into **Realtime Database → Rules** (or use `database.rules.json`):

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        "role": {
          ".validate": "newData.val() == 'user' || (root.child('users').child(auth.uid).child('role').val() == 'admin')"
        }
      }
    },

    "slots": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'"
    },

    "bookings": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'",
      "$bookingId": {
        ".read": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && (
          (!data.exists() && newData.child('userId').val() == auth.uid && newData.child('status').val() == 'pending')
          || root.child('users').child(auth.uid).child('role').val() == 'admin'
          || (data.child('userId').val() == auth.uid && newData.child('userId').val() == auth.uid)
        )"
      }
    },

    "notifications": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'",
      ".write": "auth != null"
    },

    "chats": {
      "$bookingId": {
        ".read": "auth != null && (
          root.child('users').child(auth.uid).child('role').val() == 'admin'
          || root.child('bookings').child($bookingId).child('userId').val() == auth.uid
        )",
        ".write": "auth != null && (
          root.child('users').child(auth.uid).child('role').val() == 'admin'
          || root.child('bookings').child($bookingId).child('userId').val() == auth.uid
        )"
      }
    }
  }
}
```

Click **Publish**.

> **Note:** This Next.js app writes to **Firestore**, not Realtime Database.  
> If you are not using RTDB, keep the locked default:

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

---

## 4. Storage Rules (bonus — needed for payment screenshots)

Paste into **Storage → Rules**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /payment-screenshots/{userId}/{fileName} {
      allow read: if request.auth != null
        && (request.auth.uid == userId
            || firestore.get(/databases/astrodata/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    match /chat-images/{bookingId}/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Publish via CLI (optional)

```bash
firebase deploy --only firestore:rules,database,storage
```

Project files:
- `firestore.rules`
- `database.rules.json`
- `storage.rules`
