// Login.jsx
import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Lottie from "lottie-react";
import lockAnimation from "../assets/shield-animation.json";
import { myContext } from "../contextprovider/sessionprovider";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { app, database } from "../firebaseConfig/config";

// Utility function to check mobile device
const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const Login = () => {
  const { emailPass, setEmailPass, isLoggedIn, setIsLoggedIn } =
    useContext(myContext);
  const auth = getAuth(app);
  const navigate = useNavigate();

  // Function to check if user exists in Firestore and redirect accordingly
  const DBWork = async (response) => {
    try {
      const passwordDB = collection(database, "passwordDB");
      const userExistQuery = query(
        passwordDB,
        where("username", "==", response.user.email)
      );
      const user = await getDocs(userExistQuery);
      if (!user.empty) {
        setIsLoggedIn(true);
        navigate("/");
      } else {
        navigate("/signup");
      }
    } catch (err) {
      alert("Database Error: " + err.message);
      setIsLoggedIn(false);
    }
  };

  // Handle login with Google
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const googleProvider = new GoogleAuthProvider();
      if (isMobile()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const response = await signInWithPopup(auth, googleProvider);
        await DBWork(response);
      }
    } catch (err) {
      alert("Google Login Error: " + err.message);
    }
  };

  // Handle login with GitHub
  const handleGithubLogin = async (e) => {
    e.preventDefault();
    try {
      const githubProvider = new GithubAuthProvider();
      if (isMobile()) {
        await signInWithRedirect(auth, githubProvider);
      } else {
        const response = await signInWithPopup(auth, githubProvider);
        await DBWork(response);
      }
    } catch (err) {
      alert("GitHub Login Error: " + err.message);
    }
  };

  // Handle form input changes for email/password login
  const handleChange = (e) => {
    setEmailPass((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle email/password login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        emailPass.username,
        emailPass.password
      );
      const response = { user: { email: emailPass.username } };
      await DBWork(response);
    } catch (err) {
      alert("Email Login Error: " + err.message);
    }
  };

  // Automatically run when user state changes + handle redirect result
  useEffect(() => {
    console.log("Login component mounted");

    // First check for redirect results
    getRedirectResult(auth)
      .then(async (result) => {
        console.log("Redirect result received:", result);
        if (result && result.user) {
          console.log("Redirect success - user:", result.user.email);
          await DBWork(result);
        } else {
          console.log("No redirect result or user is null");
        }
      })
      .catch((err) => {
        console.error("Redirect Auth Error:", err);
        alert("Authentication failed after redirect: " + err.message);
      });

    // Then set up auth state change listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      if (user) {
        const response = { user: { email: user.email } };
        try {
          await DBWork(response);
        } catch (error) {
          console.error("Error in DBWork during auth state change:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-wide">
          Login to <span className="text-yellow-400">PassGuard</span>
        </h2>

        {/* Google and GitHub OAuth Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow-md"
            title="Login with Google"
          >
            <FaGoogle className="text-xl text-red-500" />
          </button>
          <button
            onClick={handleGithubLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow-md"
            title="Login with GitHub"
          >
            <FaGithub className="text-xl text-black" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-6">
          <span className="flex-1 border-b border-white/30"></span>
          <span className="mx-3 text-sm text-gray-200 animate-bounce">
            or login with email
          </span>
          <span className="flex-1 border-b border-white/30"></span>
        </div>

        {/* Email and Password Login Form */}
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
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 shadow-md"
          >
            Login
          </button>
        </form>

        {/* Redirect to Sign Up */}
        <p className="mt-5 text-sm text-center text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
