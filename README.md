Bilkul bhai, ab tu backend bhi use kar raha hai (Express + MongoDB with Mongoose), toh README mein local storage wali baat hata ke **proper backend API aur database** mention karna padega. Neeche updated `README.md` diya hai with real backend flow:

---

# 🔐 PassGuard - Password Manager

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

---

## 📌 Description
**PassGuard** is a full-stack web application built to securely manage and store passwords. It provides a clean UI, responsive design, and real-time feedback using modern technologies. All data is now stored in **MongoDB** using a custom **Express.js API**, making the app more robust and scalable compared to localStorage.

---

## 🚀 Features
- Add, update, delete, and view stored passwords
- Search functionality to filter credentials quickly
- Password visibility toggle (Show/Hide)
- Responsive design using Tailwind CSS
- Realtime toast notifications
- Smooth animations via Lottie
- Regex-based input validation
- REST API integration with secure MongoDB backend

---

## 🛠️ Tech Stack

### Frontend:
- React.js  
- Tailwind CSS  
- React Router DOM  
- Context API  
- Toastify (Notifications)  
- Lottie (Animations)  

### Backend:
- Express.js  
- Node.js  
- MongoDB with Mongoose

---

## 🔧 Installation

### Clone & Setup Frontend
```bash
git clone https://github.com/your-username/passwordmanager.git
cd passwordmanager
npm install
npm run dev
```

### Clone & Setup Backend
```bash
cd server
npm install
npm run dev
```

📌 Make sure MongoDB is running locally or use MongoDB Atlas. Configure your `.env` file in the server directory with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

## ▶️ Usage
1. Navigate to `http://localhost:5173` to access the frontend.
2. Use the Home screen to add credentials.
3. View/Edit/Delete entries as needed.
4. Backend APIs handle all CRUD operations securely.

---

## 🗂️ Folder Structure

```
passwordmanager/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contextprovider/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── .env
└── README.md
```

---

## 📡 API Endpoints (Backend)

| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/userLists` | Get all saved passwords |
| POST   | `/api/create` | Add a new password |
| PUT    | `/api/updateUser/:id` | Update a password |
| DELETE | `/api/deleteUser/:id` | Delete a password |

---

## 🤝 Contributing
Contributions are welcome!  
1. Fork the repository  
2. Create a branch: `git checkout -b feature-name`  
3. Commit your changes  
4. Push to the branch  
5. Open a Pull Request

---


---