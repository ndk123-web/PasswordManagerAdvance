// Login.jsx
import React, { useEffect, useContext, useState } from "react"; // Import necessary React hooks
import { Link, useNavigate } from "react-router-dom"; // Import navigation and linking utilities
import { FaGithub, FaGoogle } from "react-icons/fa"; // Import Google and GitHub icons
import { myContext } from "../contextprovider/sessionprovider"; // Import custom context provider
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth"; // Import Firebase authentication methods
import { collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore methods
import { app, database } from "../firebaseConfig/config"; // Import Firebase app and database configuration

const Login = () => {
  const { emailPass, setEmailPass, isLoggedIn, setIsLoggedIn } =
    useContext(myContext); // Access context values for email/password and login state
  const auth = getAuth(app); // Initialize Firebase authentication
  const navigate = useNavigate(); // Initialize navigation utility
  const [loading, setLoading] = useState(true); // State to manage loading status

  const DBWork = async (response) => {
    try {
      const passwordDB = collection(database, "passwordDB"); // Reference to Firestore collection
      const userExistQuery = query(
        passwordDB,
        where("username", "==", response.user.email)
      ); // Query to check if user exists
      const userSnapshot = await getDocs(userExistQuery); // Execute query

      if (!userSnapshot.empty) {
        setIsLoggedIn(true); // Update login state
        setLoading(false); // Stop loading
        navigate("/", { replace: true }); // Navigate to home page
      } else {
        setLoading(false); // Stop loading
        navigate("/signup", { replace: true }); // Navigate to signup page
      }
    } catch (err) {
      console.error("DBWork error:", err); // Log error
      alert("Database Error: " + err.message); // Show error message
      setIsLoggedIn(false); // Reset login state
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence); // Set persistence for authentication
      } catch (error) {
        console.error("Failed to set persistence:", error); // Log error
      }
    };

    initAuth(); // Initialize authentication persistence
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        DBWork({ user: { email: user.email } }); // Perform database operations if user is logged in
      } else {
        setLoading(false); // Stop loading if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const handleGoogleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading

    try {
      const googleProvider = new GoogleAuthProvider(); // Initialize Google provider
      const response = await signInWithPopup(auth, googleProvider); // Sign in with Google
      await DBWork(response); // Perform database operations
    } catch (err) {
      console.error("Google login error:", err); // Log error
      alert("Google Login Error: " + err.message); // Show error message
      setLoading(false); // Stop loading
    }
  };

  const handleGithubLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading

    try {
      const githubProvider = new GithubAuthProvider(); // Initialize GitHub provider
      const response = await signInWithPopup(auth, githubProvider); // Sign in with GitHub
      await DBWork(response); // Perform database operations
    } catch (err) {
      console.error("GitHub login error:", err); // Log error
      alert("GitHub Login Error: " + err.message); // Show error message
      setLoading(false); // Stop loading
    }
  };

  const handleChange = (e) => {
    setEmailPass((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    })); // Update email/password state on input change
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailPass.username,
        emailPass.password
      ); // Sign in with email and password
      await DBWork({ user: { email: userCredential.user.email } }); // Perform database operations
    } catch (err) {
      console.error("Email login error:", err); // Log error
      alert("Email Login Error: " + err.message); // Show error message
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-wide">
          Login to <span className="text-yellow-400">PassGuard</span>
        </h2>

        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow-md"
            title="Login with Google"
            disabled={loading}
          >
            <FaGoogle className="text-xl text-red-500" />
          </button>
          <button
            onClick={handleGithubLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow-md"
            title="Login with GitHub"
            disabled={loading}
          >
            <FaGithub className="text-xl text-black" />
          </button>
        </div>

        <div className="flex items-center justify-center mb-6">
          <span className="flex-1 border-b border-white/30"></span>
          <span className="mx-3 text-sm text-gray-200 animate-bounce">
            or login with email
          </span>
          <span className="flex-1 border-b border-white/30"></span>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <input
            type="email"
            name="username"
            placeholder="Email"
            value={emailPass.username}
            onChange={handleChange}
            autoComplete="username"
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-yellow-400"
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={emailPass.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:ring-2 focus:ring-yellow-400"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 shadow-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
