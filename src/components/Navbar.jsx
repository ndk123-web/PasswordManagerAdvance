import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import Lottie from "lottie-react";
import lockAnimation from "../assets/shield-animation.json";

import { myContext } from "../contextprovider/sessionprovider";
import { useContext } from "react";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { app, database } from "../firebaseConfig/config";
import { query, where, collection, getDocs } from "firebase/firestore";

// Navbar.jsx
// This component renders the navigation bar for the application.
// It includes links to different pages, a logo, and login/logout functionality.

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(myContext);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [userData, setUserData] = useState({ uid: "", username: "", url: "" });

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // useEffect to fetch user data from Firebase Firestore when the component mounts.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const passwordDB = collection(database, "passwordDB");
          const userExistQuery = query(
            passwordDB,
            where("username", "==", user.email)
          );
          const querySnapShot = await getDocs(userExistQuery);

          if (!querySnapShot.empty) {
            const userDoc = querySnapShot.docs[0].data(); // Assume only one match
            setUserData({
              uid: user.uid,
              username: userDoc.email || user.email,
              url: user.photoURL || "", // fallback if no photoURL
            });
            setIsLoggedIn(true);
          } else {
            alert("No user found in DB");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    // it's Important whenever we reload the setILoggedIn must be True else in each reload we wont be able to get data about user
    return () => unsubscribe();
  }, []);

  // handleLogOut function to log out the user and navigate to the login page.
  const handleLogOut = async () => {
    onAuthStateChanged(auth, async (user) => {
      console.log(user);
    });
    await signOut(auth);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 flex justify-between items-center shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 h-18">
      {/* Logo with Animation */}
      <Link to={"/"}>
        <div className="flex items-center space-x-2">
          <Lottie
            animationData={lockAnimation}
            loop={true}
            className="w-12 h-12 -ml-2"
          />
          <span className="text-white font-extrabold text-2xl bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            PassGuard
          </span>
        </div>
      </Link>

      {/* Hamburger Icon */}
      <button
        className="md:hidden text-white z-50 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6 animate-spin-in" />
        ) : (
          <FaBars className="w-6 h-6 animate-pulse" />
        )}
      </button>

      {/* Navigation Links */}
      <ul
        className={`md:flex md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto 
  bg-purple-600/95 md:bg-transparent flex-col md:flex-row items-center transition-all duration-300 ease-in-out 
  ${isOpen ? "max-h-[500px] py-4 opacity-100" : "max-h-0 opacity-0"} 
  md:max-h-full md:opacity-100 overflow-hidden z-40`}
      >
        <NavItem
          to="/"
          icon={<FaHome />}
          text="Home"
          onClick={handleLinkClick}
        />
        <NavItem
          to="/about"
          icon={<FaList />}
          text="My Lists"
          onClick={handleLinkClick}
        />
        <NavItem
          to="/contact"
          icon={<FaEnvelope />}
          text="Contact"
          onClick={handleLinkClick}
        />

        {/* ✅ Login / Logout Button */}
        <li className="w-full md:w-auto flex items-center gap-3">
          {isLoggedIn && (
            <div className="flex items-center space-x-3 px-4 py-2 text-white bg-white/10 rounded-full backdrop-blur-md">
              {/* Circular Icon or Logo */}
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-sm">
                <img
                  className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-sm"
                  src={
                    userData.url ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                ></img>
              </div>
              {/* Username / Email */}
              <span className="font-medium tracking-wide text-sm md:text-base">
                {auth.currentUser.displayName || "Guest"}
              </span>
            </div>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogOut}
              className="flex items-center space-x-3 px-6 py-3 md:py-2 text-white hover:bg-white/10 md:hover:bg-transparent md:hover:text-yellow-300 transition-all duration-300 group"
            >
              <span className="text-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                <FaUser />
              </span>
              <span className="font-medium tracking-wide">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-3 px-6 py-3 md:py-2 text-white hover:bg-white/10 md:hover:bg-transparent md:hover:text-yellow-300 transition-all duration-300 group"
            >
              <span className="text-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                <FaUser />
              </span>
              <span className="font-medium tracking-wide">Login</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

const NavItem = ({ to, icon, text, onClick }) => (
  <li className="w-full md:w-auto">
    <Link
      to={to}
      className="flex items-center space-x-3 px-6 py-3 md:py-2 text-white hover:bg-white/10 md:hover:bg-transparent md:hover:text-yellow-300 transition-all duration-300 group"
      onClick={onClick}
    >
      <span className="text-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="font-medium tracking-wide">{text}</span>
    </Link>
  </li>
);

export default Navbar;
