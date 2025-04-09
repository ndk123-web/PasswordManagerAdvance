// problem with google and signup duplicate user is accessing
// solution -> need to add query and where and validate in DBWork Function

import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Navigation and link components
import { FaGoogle, FaGithub } from "react-icons/fa"; // Icons for buttons
import { nanoid } from "nanoid"; // For generating random IDs

import { myContext } from "../contextprovider/sessionprovider"; // Global context for form state
import { app, database } from "../firebaseConfig/config"; // Firebase app and Firestore DB config

// Firebase Auth imports
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Firestore functions
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const Signup = () => {
  const { emailPass, setEmailPass } = useContext(myContext); // Access global form state
  const auth = getAuth(app);
  const navigate = useNavigate();

  // Handle input changes and update state
  const handleChange = (e) => {
    setEmailPass((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Reset input fields
  const ResetEmailPass = () => {
    setEmailPass({ username: "", password: "" });
  };

  // Add user data to Firestore database
  const DbWork = async (username, password, imageURL, uid) => {
    try {
      const passwordDB = collection(database, "passwordDB");

      // Step 1: Check if user already exists by username
      const userExistQuery = query(
        passwordDB,
        where("username", "==", emailPass.username || username)
      );

      const querySnapshot = await getDocs(userExistQuery);

      if (!querySnapshot.empty) {
        // User with this username already exists
        alert("User already exists in database!");
        return; // Don't proceed further
      }

      // Step 2: Add new user
      const myListRef = await addDoc(passwordDB, {
        username: emailPass.username || username,
        password: emailPass.password || password,
        url: imageURL || "",
        uid: uid || nanoid(16),
      });

      // Step 3: (Optional) Create subcollection (if needed later)
      const subCollection = collection(
        database,
        "passwordDB",
        myListRef.id,
        "userLists"
      );

      alert("Success Sign Up");
      navigate("/");
      ResetEmailPass();
    } catch (error) {
      console.error("Error in DbWork:", error.message);
      alert("Something went wrong. Try again.");
    }
  };

  // Handle Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (emailPass.username === "" || emailPass.password === "") {
        alert("Enter Fields");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailPass.username,
        emailPass.password
      );

      const uid = userCredential.user.uid;
      DbWork(emailPass.username, emailPass.password, "", uid);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("User already exists!");
      } else {
        alert(err.message);
      }
    }
  };

  // const checkIsSignUp = (email){

  // }

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, googleProvider);
      await DbWork(
        response.user.email,
        nanoid(16),
        response.user.photoURL,
        response.user.uid
      );
      alert("Successfully Sign Up With Google");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle GitHub Signup
  const handleGithubSignup = async () => {
    try {
      const githubProvider = new GithubAuthProvider();
      const response = await signInWithPopup(auth, githubProvider);
      await DbWork(
        response.user.email,
        nanoid(16),
        response.user.photoURL,
        response.user.uid
      );
      alert("Success Github Sign Up");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Create Account
        </h2>

        {/* Social Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={handleGoogleSignup}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-xl cursor-pointer"
            title="Signup with Google"
          >
            <FaGoogle className="text-xl text-red-500" />
          </button>
          <button
            onClick={handleGithubSignup}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-xl cursor-pointer"
            title="Signup with GitHub"
          >
            <FaGithub className="text-xl text-black" />
          </button>
        </div>

        <div className="relative text-center text-white mb-6 animate-bounce">
          <span className="text-sm">or sign up with email</span>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            name="username"
            value={emailPass.username}
            onChange={handleChange}
            required
            placeholder="Email"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
          <input
            type="password"
            name="password"
            value={emailPass.password}
            onChange={handleChange}
            required
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-xl"
          >
            Sign Up
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-white text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
