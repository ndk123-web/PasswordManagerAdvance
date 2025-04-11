---

# 🔐 Password Manager – React + Firebase Fullstack App

A full-fledged password manager application built using **React (Vite)** and **Firebase**. This app supports secure user authentication (Email/Google/GitHub) and CRUD operations on password entries stored in Firestore.

---

## 🧱 Component-Wise Breakdown

---

### ✅ `Signup.jsx`

Handles **registration** using three methods:
- 📧 Email/Password (`createUserWithEmailAndPassword`)
- 🟢 Google Login (`signInWithPopup` using `GoogleAuthProvider`)
- ⚫ GitHub Login (`signInWithPopup` using `GithubAuthProvider`)

**Logic**:
- On success, calls a `DbWork()` function:
  - Checks if the user already exists in Firestore using:
    ```js
    query(passwordDB, where("username", "==", email));
    ```
  - If not found, adds new document with `username`, `uid`, `password`, `photoURL`.

---

### 🔓 `Signin.jsx`

Handles **login** via:
- Email/Password: `signInWithEmailAndPassword`
- Google & GitHub: `signInWithPopup` using relevant providers.

**After successful login**:
- Redirects to `/` (home/dashboard).
- Context state is updated for session.

---

### 🏠 `Home.jsx`

Main dashboard shown after login.

**Functionality**:
- Fetches and displays the current user's password entries.
- Password entries are stored under `"passwordDB"` with fields like:
  - `name`, `password`, `email`, `uid`, `date`

**Features**:
- Add new entries
- Delete entries
- Edit redirects to `/edit/:id`

---

### ✏️ `Edit.jsx`

Component to **edit** existing password entries.

**How it works**:
- Retrieves the `id` from URL via `useParams`.
- Fetches the entry from Firestore using:
  ```js
  doc(passwordDB, id)
  ```
- Updates the entry with `updateDoc()`.

---

### 📬 `Contact.jsx`

A basic contact/help page.

**Use Cases**:
- You can add form inputs for user feedback or future support integrations.

---

### 🧭 `Navbar.jsx`

Top navigation bar component.

**Features**:
- Shows links to `Home`, `Contact`, and `Signout`.
- Displays user's profile photo (if available).
- Includes logout functionality:
  ```js
  signOut(auth)
  ```

---

### 🌐 `contextprovider/sessionprovider.jsx`

Custom context for sharing **session/user state** across components.

**Why it's used**:
- Holds current user’s email, UID, etc.
- Avoids prop-drilling between components.
- Helps centralize authentication status.

---

### 🔥 `firebaseConfig/config.js`

Initializes Firebase App and services.

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
```

Exports:
- `auth`, `provider`, `githubProvider`
- `db`, and `passwordDB` collection reference

---

## 📦 Optional Utility Functions

- `DbWork(user)` – Inserts user into Firestore if not already present
- `getAllPasswords()` – Fetch all passwords from Firestore
- `deleteEntry(id)` – Deletes a password document
- `updateEntry(id, newData)` – Updates a password entry

---

## ⚙️ Technologies Used

- 🔧 **React** (Vite + JSX)
- ☁️ **Firebase Auth** (Email, Google, GitHub)
- 📂 **Firestore** (Cloud NoSQL Database)
- 🎨 **TailwindCSS** (for styling)
- 🧠 **React Context API** (session handling)
- 🚀 **React Router DOM** (page navigation)

---

## 📁 Folder Structure (Short Overview)

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Contact.jsx
│   ├── Signup.jsx
│   ├── Signin.jsx
│   ├── Home.jsx
│   └── Edit.jsx
├── contextprovider/
│   └── sessionprovider.jsx
├── firebaseConfig/
│   └── config.js
├── App.jsx
└── main.jsx
```

---

## 🧪 Testing the Flow

1. Start app: `npm run dev`
2. Visit `/signup` and test:
   - Email/Password sign up
   - Google OAuth
   - GitHub OAuth
3. Check Firestore for `"passwordDB"` entries.
4. Use `/` (Home) to view, edit, delete password entries.
5. Use `/edit/:id` to update saved credentials.

---

## 📌 Final Summary

| Feature                 | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| Signup (3 methods)      | Email/Password, Google, GitHub with duplication check in Firestore         |
| Signin                 | Authenticates user and sets session context                                 |
| Dashboard (Home)       | Fetches and displays user's saved passwords                                 |
| Add/Edit/Delete        | Full CRUD functionality with Firestore                                      |
| Navigation Bar         | Handles routing and logout                                                  |
| Context API            | Stores and provides auth/session data across app                           |
| Firestore Integration  | Real-time database used to manage user and password data                    |

---