# 🔐 Password Manager | React + Firebase

![Password Manager](https://img.shields.io/badge/Password%20Manager-v1.0-blue)
![React](https://img.shields.io/badge/React-v18.x-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-v9.x-FFCA28?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.x-38B2AC?logo=tailwind-css)

A secure, full-stack password manager built with React (Vite) and Firebase. Store, manage, and organize your passwords with multiple authentication options and real-time database updates.

## ✨ Features

- 🔐 Secure user authentication (Email/Password, Google, GitHub)
- 📝 Create, read, update, and delete password entries
- 🔄 Real-time updates with Firestore
- 🎨 Modern, responsive UI with TailwindCSS
- 📱 Mobile-friendly design
- 🔒 Password encryption

## 🔥 Firebase Core Services

### Firestore Database

Firestore is Firebase's NoSQL document-based database that enables:

- **Real-time data sync** across client devices
- **Offline support** for mobile/web apps
- **Hierarchical data** through documents and collections
- **Security rules** for data protection
- **Scalability** for growing applications

In this app, Firestore stores:

- User account information in `passwordDB` collection
- Individual password entries with fields like `name`, `password`, `email`, `uid`, and `date`

### Firebase Authentication

Firebase Auth provides:

- **Multiple sign-in methods** (Email/Password, OAuth providers)
- **Secure user management**
- **Customizable UI flows**
- **JWT-based authentication** for security

The app leverages Firebase Auth through:

- Multiple sign-in providers (Email, Google, GitHub)
- `onAuthStateChanged` listener to detect authentication state changes
- Secure session management

## 📁 App Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation and logout
│   ├── Contact.jsx         # Contact/support page
│   ├── Signup.jsx          # User registration
│   ├── Signin.jsx          # User authentication
│   ├── Home.jsx            # Dashboard/main view
│   └── Edit.jsx            # Password entry editor
├── contextprovider/
│   └── sessionprovider.jsx # Auth state management
├── firebaseConfig/
│   └── config.js           # Firebase initialization
├── App.jsx                 # Main app component
└── main.jsx                # Entry point
```

## 🧩 Key Components

### 🔒 Authentication Components

#### Signup.jsx

- Handles user registration with three methods:
  - Email/Password authentication
  - Google OAuth
  - GitHub OAuth
- Creates user profiles in Firestore
- Implements duplicate user checking
- Provides toast notifications for user feedback

#### Signin.jsx

- Manages login functionality via multiple providers
- Utilizes Firebase's `signInWithEmailAndPassword` and OAuth methods
- Updates global auth context state upon successful login
- Redirects to the dashboard after authentication

### 📱 Core App Components

#### Home.jsx (Dashboard)

- Central hub for password management
- Fetches and displays the current user's password entries
- Implements full CRUD operations:
  - Add new password entries
  - View existing passwords
  - Delete unwanted entries
  - Navigate to edit mode
- Real-time updates with Firestore listeners

#### Edit.jsx

- Allows users to modify existing password entries
- Retrieves entries by ID from URL parameters
- Updates entries in real-time with `updateDoc()`
- Form validation for data integrity

#### Navbar.jsx

- Persistent navigation across the app
- Dynamic rendering based on authentication state
- User profile information display
- Logout functionality using `signOut(auth)`

### 🔄 State Management

#### sessionprovider.jsx

- Implements React Context API for global state
- Tracks authentication status with `onAuthStateChanged`
- Provides user data across components
- Centralizes session management

## ⚙️ Firebase Configuration

```javascript
// firebaseConfig/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

export { app, auth, database };
```

## 🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/password-manager.git
   cd password-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a Firebase project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password, Google, GitHub)
   - Create a Firestore database

4. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Implementation Details

### Authentication Flow

The app implements a comprehensive authentication system:

1. **User Registration**:

   - Email/password validation
   - OAuth integration
   - User data storage in Firestore

2. **Session Management**:

   ```javascript
   // Example from sessionprovider.jsx
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         setIsLoggedIn(true);
         setUserData({
           email: user.email,
           uid: user.uid,
           photoURL: user.photoURL,
         });
       } else {
         setIsLoggedIn(false);
         setUserData(null);
       }
     });

     return () => unsubscribe();
   }, []);
   ```

3. **Protected Routes**:
   - Redirect unauthenticated users
   - Secure access to password data

### Firestore Data Structure

```
passwordDB (collection)
├── users (document)
│   ├── username: string
│   ├── password: string
│   ├── url: string
│   └── uid: string
│
└── passwords (document)
    ├── name: string
    ├── password: string
    ├── email: string
    ├── uid: string
    └── date: timestamp
```

## 📈 Future Enhancements

- 🔐 Password strength meter
- 🔄 Password generation functionality
- 🔔 Security alerts for compromised passwords
- 📱 Mobile app using React Native
- 🌐 Browser extension integration
- 🔒 End-to-end encryption
- 📊 Password analytics and reporting

## 🛡️ Security Considerations

- Passwords are stored in Firestore with appropriate security rules
- Authentication state is managed securely
- Consider implementing additional encryption for sensitive data
- Firestore rules should restrict access to only authenticated users

## 📜 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📬 Contact

For questions or support, please reach out via the Contact form in the app.

---

_Built with ❤️ using React and Firebase_
