import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGlobe, FaUser, FaLock } from "react-icons/fa";
import Lottie from "lottie-react";
import checkAnimation from '../assets/check-animation.json';
import addAnimation from '../assets/add-animation.json';

const Home = () => {
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userLists, setUserLists] = useState([]);

  // Error states
  const [websiteError, setWebsiteError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userLists")) || [];
    setUserLists(storedData);
  }, []);

  // Live validation
  useEffect(() => {
    // Website validation
    if (website && !/^https?:\/\/.+\..+/.test(website)) {
      setWebsiteError("Enter a valid URL (e.g., https://example.com)");
    } else {
      setWebsiteError("");
    }

    // Username validation
    if (username && username.length < 4) {
      setUsernameError("Username must be at least 4 characters");
    } else {
      setUsernameError("");
    }

    // Password validation
    if (
      password &&
      (password.length < 5 || !/@/.test(password) || !/\d/.test(password))
    ) {
      setPasswordError("Password must be 5+ chars, include @ and a number");
    } else {
      setPasswordError("");
    }
  }, [website, username, password]);

  const handleSubmit = () => {
    if (!website || !username || !password || websiteError || usernameError || passwordError) {
      toast.error('Please correct all fields!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "colored",
      });
      return;
    }

    const newUser = { website, username, password };
    const updatedUserLists = [...userLists, newUser];
    setUserLists(updatedUserLists);
    localStorage.setItem("userLists", JSON.stringify(updatedUserLists));
    
    toast.success(
      <div className="flex items-center">
        <span className="ml-2">Password saved successfully!</span>
      </div>, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "colored",
      });

    setWebsite("");
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <ToastContainer />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-indigo-600 to-purple-800 text-white p-6 pt-0">
        <h1 className="text-4xl font-extrabold mb-6 animate-bounce">PassGuard - Secure Your Passwords</h1>
        
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-gray-800 space-y-4">
          
          {/* Website */}
          <div className="flex flex-col">
            <div className="flex items-center border-b-2 border-gray-300 py-2">
              <FaGlobe className="text-indigo-500 text-xl animate-spin" />
              <input 
                type="text" 
                placeholder="Website (e.g., https://example.com)" 
                className="ml-3 w-full p-2 outline-none" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            {websiteError && <p className="text-red-500 text-sm mt-1">{websiteError}</p>}
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <div className="flex items-center border-b-2 border-gray-300 py-2">
              <FaUser className="text-indigo-500 text-xl animate-pulse" />
              <input 
                type="text" 
                placeholder="Username" 
                className="ml-3 w-full p-2 outline-none" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <div className="flex items-center border-b-2 border-gray-300 py-2">
              <FaLock className="text-indigo-500 text-xl animate-wiggle" />
              <input 
                type="password" 
                placeholder="Password" 
                className="ml-3 w-full p-2 outline-none" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <button 
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2"
            onClick={handleSubmit}
          >
            <Lottie
              animationData={addAnimation}
              loop={true}
              style={{ width: 24, height: 24 }}
            />
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
