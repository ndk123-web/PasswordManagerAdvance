import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";
import lockAnimation from "../assets/shield-animation.json";
import Lottie from "lottie-react";

const Login = () => {
  const handleGoogleLogin = () => {
    console.log("Google Login Clicked");
  };

  const handleGithubLogin = () => {
    console.log("GitHub Login Clicked");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form Submitted");
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
          <span className="mx-3 text-sm text-gray-200 tracking-wide animate-pulse">
            or login with email
          </span>
          <span className="flex-1 border-b border-white/30"></span>
        </div>

        {/* Email Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 caret-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
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
