import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";
import lockAnimation from "../assets/shield-animation.json";
import Lottie from "lottie-react";
import { myContext } from "../contextprovider/sessionprovider";
import { useContext } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { app, database } from "../firebaseConfig/config";
import { set } from "mongoose";

const Login = () => {
  const { emailPass, setEmailPass, isLoggedIn, setIsLoggedIn } =
    useContext(myContext);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const DBWork = async (response) => {
    try {
      const passwordDB = collection(database, "passwordDB");
      const userExistQuery = query(
        passwordDB,
        where("username", "==", response.user.email)
      );
      const user = await getDocs(userExistQuery);
      if (!user.empty) {
        navigate("/");
        setIsLoggedIn(true);
      } else {
        navigate("/signup");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();

    try {
      const googleProvider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, googleProvider);
      // console.log(response);
      await DBWork(response);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGithubLogin = async (e) => {
    e.preventDefault();

    try {
      const githubProvider = new GithubAuthProvider();
      const response = await signInWithPopup(auth, githubProvider);
      await DBWork(response);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user.empty) {
        await DBWork(user);
        navigate("/");
      } else {
        alert("Please Login");
        navigate("/login");
      }
      return () => unsubscribe();
    });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setEmailPass((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white transform transition-all duration-300 hover:scale-[1.015]">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-wide">
          Login to <span className="text-yellow-400">PassGuard</span>
        </h2>

        {/* OAuth Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-xl cursor-pointer"
            title="Login with Google"
          >
            <FaGoogle className="text-xl text-red-500" />
          </button>
          <button
            onClick={handleGithubLogin}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-xl cursor-pointer"
            title="Login with GitHub"
          >
            <FaGithub className="text-xl text-black" />
          </button>
        </div>

        {/* Divider with subtle animation */}
        <div className="flex items-center justify-center mb-6">
          <span className="flex-1 border-b border-white/30"></span>
          <span className="mx-3 text-sm text-gray-200 tracking-wide animate-bounce">
            or login with email
          </span>
          <span className="flex-1 border-b border-white/30"></span>
        </div>

        {/* Email Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            name="username"
            onChange={handleChange}
            value={emailPass.username}
            autoComplete="username"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 caret-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={emailPass.password}
            autoComplete="current-password"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 caret-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-400 font-medium hover:underline transition-all duration-200 cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
