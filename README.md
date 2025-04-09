# 🔐 Firebase Signup System (Email/Google/GitHub) with Firestore User Management

This project implements a secure and user-friendly signup system using **Firebase Authentication** and **Firestore Database**. It supports the following signup methods:

- 📧 Email and Password
- 🔵 Google OAuth
- ⚫ GitHub OAuth

---

## 📁 Folder Structure (Important Files)

- `Signup.jsx` – Main Signup component with form and social buttons
- `firebaseConfig/config.js` – Firebase App and Firestore initialization
- `contextprovider/sessionprovider.js` – Global context for handling email/password state

---

## 🧠 Features & Workflow

### 1. 🔒 Email/Password Signup Flow

- User fills out the email and password.
- On `submit`:
  - Firebase `createUserWithEmailAndPassword()` creates a new Auth user.
  - If the email is **already registered**, Firebase throws `auth/email-already-in-use`.
- After successful creation:
  - Firestore is queried to check if the user already exists in the `"passwordDB"` collection using:
    ```js
    query(passwordDB, where("username", "==", email));
    ```
  - If the user **does not exist** in Firestore:
    - A new document is added with `username`, `password`, `uid`, and optionally `photoURL`.
  - Navigation back to homepage + reset form.

### 2. 🟢 Google Signup Flow

- Uses `GoogleAuthProvider` and `signInWithPopup()` from Firebase Auth.
- After successful login:
  - Same `DbWork()` function is called to add user details to Firestore.
  - Email (username) is checked for duplication.
  - New user is added if not already present.

### 3. ⚫ GitHub Signup Flow

- Uses `GithubAuthProvider` and `signInWithPopup()` from Firebase Auth.
- Same duplication check and Firestore insertion logic is applied.

---

## 🔁 Firestore Duplication Logic

The system ensures **no duplicate user entries** in Firestore by:
- Using a `query` and `where` clause:
  ```js
  query(passwordDB, where("username", "==", username));
