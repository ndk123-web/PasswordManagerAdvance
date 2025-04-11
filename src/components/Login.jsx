// Login.jsx
import React, { useEffect, useContext, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  // Function to check if user exists in Firestore and redirect accordingly
  const DBWork = async (response) => {
    try {
      console.log("DBWork starting with email:", response.user.email);
      const passwordDB = collection(database, "passwordDB");
      const userExistQuery = query(
        passwordDB,
        where("username", "==", response.user.email)
      );
      const userSnapshot = await getDocs(userExistQuery);

      if (!userSnapshot.empty) {
        console.log("USER EXISTS - Navigating to home page");
        setIsLoggedIn(true);
        setLoading(false);
        navigate("/", { replace: true }); // Use replace to prevent back navigation
      } else {
        console.log("USER DOES NOT EXIST - Navigating to signup");
        setLoading(false);
        navigate("/signup", { replace: true });
      }
    } catch (err) {
      console.error("DBWork error:", err);
      alert("Database Error: " + err.message);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  // At the top of your Login component
  useEffect(() => {
    const initAuth = async () => {
      const { browserLocalPersistence, setPersistence } = await import(
        "firebase/auth"
      );
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Set persistence to LOCAL");
      } catch (error) {
        console.error("Failed to set persistence:", error);
      }
    };

    initAuth();
  }, []);

  // Handle redirect results on component mount
  // In your useEffect
  useEffect(() => {
    const auth = getAuth(app);
    console.log("Login component initialized");

    // First check redirect result with proper error handling
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("REDIRECT SUCCESS - User:", result.user.email);
          return DBWork(result);
        } else {
          console.log("No redirect result found");
        }
      })
      .catch((error) => {
        console.error("Redirect error:", error.code, error.message);
        // Don't alert on redirect errors - often happens on first load
      })
      .finally(() => {
        // Always check auth state after redirect check completes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("Auth state changed - User is signed in:", user.email);
            DBWork({ user: { email: user.email } });
          } else {
            console.log("Auth state changed - No user signed in");
            setLoading(false);
          }
        });

        return () => unsubscribe();
      });
  }, []);

  // Handle login with Google
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting Google login");
      const googleProvider = new GoogleAuthProvider();

      if (isMobile()) {
        console.log("Mobile device detected, using signInWithRedirect");
        await signInWithRedirect(auth, googleProvider);
        // The redirect will happen here, so code below won't execute until return
      } else {
        console.log("Desktop device detected, using signInWithPopup");
        const response = await signInWithPopup(auth, googleProvider);
        console.log("Popup success, user:", response.user.email);
        await DBWork(response);
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google Login Error: " + err.message);
      setLoading(false);
    }
  };

  // Handle login with GitHub
  const handleGithubLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting GitHub login");
      const githubProvider = new GithubAuthProvider();

      if (isMobile()) {
        console.log("Mobile device detected, using signInWithRedirect");
        await signInWithRedirect(auth, githubProvider);
        // The redirect will happen here, so code below won't execute until return
      } else {
        console.log("Desktop device detected, using signInWithPopup");
        const response = await signInWithPopup(auth, githubProvider);
        console.log("Popup success, user:", response.user.email);
        await DBWork(response);
      }
    } catch (err) {
      console.error("GitHub login error:", err);
      alert("GitHub Login Error: " + err.message);
      setLoading(false);
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
    setLoading(true);

    try {
      console.log("Attempting email/password login");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailPass.username,
        emailPass.password
      );
      console.log("Email login success, user:", userCredential.user.email);
      await DBWork({ user: { email: userCredential.user.email } });
    } catch (err) {
      console.error("Email login error:", err);
      alert("Email Login Error: " + err.message);
      setLoading(false);
    }
  };

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

        {/* Redirect to Sign Up */}
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
