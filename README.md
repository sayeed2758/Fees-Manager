# MMT Fees Manager — Phase 2

This phase keeps the supplied mobile UI style and moves the app from local-only storage to a real Firebase cloud foundation.

## Included
- Same Dashboard / Students / Payments / Reports interface
- Firebase Email/Password login and account creation
- Firestore cloud student records
- Firestore monthly fee records
- Real-time cloud sync
- Add, Edit and Delete students
- Duplicate-safe monthly fee generation
- Mark Paid / Revert
- WhatsApp reminder / Call shortcuts
- Receipt preview
- Per-account Firestore security rules
- No Node/npm setup required for this phase: it is a static Vercel-ready app using Firebase browser modules

## IMPORTANT
Firebase is not connected yet because your Firebase project credentials are created inside your own account. The project therefore contains placeholders in:

`assets/firebase-config.js`

## Setup from zero

### 1. Create a Firebase project
Open Firebase Console, create a new project, then register a Web App.

From the Web App configuration, copy these six values into `assets/firebase-config.js`:

- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId

Do not paste a Firebase Admin SDK/service-account private key into this file.

### 2. Enable login
Firebase Console → Authentication → Sign-in method → enable **Email/Password**.

### 3. Create Firestore
Firebase Console → Firestore Database → Create database.

### 4. Publish the included security rules
Install the Firebase CLI on your computer if needed, then run:

```bash
npx firebase-tools login
npx firebase-tools use YOUR_PROJECT_ID
npx firebase-tools deploy --only firestore:rules
```

The rules in `firestore.rules` only allow a signed-in user to read/write documents below their own `users/{uid}` path.

### 5. Test locally
Because this app uses browser modules, serve the folder over HTTP rather than using `file://`.

A simple option with Python:

```bash
python -m http.server 5500
```

Then open:

`http://localhost:5500`

### 6. Deploy to Vercel
Upload the project to GitHub and import that repository into Vercel.

This is a static project, so no build command is required. Vercel can serve `index.html` directly.

## Cloud data structure

```text
users/{uid}
  students/{studentId}
  fees/{feeId}
  settings/{settingId}
```

## Phase 2 boundary
This phase deliberately focuses on the cloud foundation. Storage, PDF generation/printing, advanced class/batch/subject management, notifications, subscription billing, backup/export, month picker, and Android/Capacitor packaging are later phases.
