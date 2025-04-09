import React, { useState } from "react";
import { Link } from "react-router-dom";
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

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(myContext);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleAuthToggle = () => {
    setIsLoggedIn(!isLoggedIn); // ✅ Toggle login/logout
    setIsOpen(false); // Close navbar on click
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
        className={`md:flex md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-purple-600/95 md:bg-transparent flex-col md:flex-row items-center transition-all duration-300 ease-out overflow-hidden
        ${
          isOpen
            ? "max-h-screen py-4 opacity-100"
            : "max-h-0 md:max-h-full opacity-0 md:opacity-100"
        }`}
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
        <li className="w-full md:w-auto">
          <button
            onClick={handleAuthToggle}
            className="flex items-center space-x-3 px-6 py-3 md:py-2 text-white hover:bg-white/10 md:hover:bg-transparent md:hover:text-yellow-300 transition-all duration-300 group"
          >
            <span className="text-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
              <FaUser />
            </span>
            <Link to={'/login'} className="font-medium tracking-wide">
              {isLoggedIn ? "Logout" : "Login"}
            </Link>
          </button>
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
