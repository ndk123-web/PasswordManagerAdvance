import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser, FaLock, FaArrowLeft, FaSave } from "react-icons/fa";
import Lottie from "lottie-react";
import editAnimation from "../assets/shield-animation.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: ""
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userLists")) || [];
    if (storedData[id]) {
      setFormData(storedData[id]);
    } else {
      toast.error("Entry not found!", { autoClose: 1000 });
      setTimeout(() => navigate("/about"), 1200);
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.website || !formData.username || !formData.password) {
      toast.error("Please fill all fields!", {
        icon: <FaSave className="text-white" />
      });
      return;
    }

    const updatedData = JSON.parse(localStorage.getItem("userLists"));
    updatedData[id] = formData;
    localStorage.setItem("userLists", JSON.stringify(updatedData));

    toast.success("Changes saved successfully!", {
      icon: <Lottie animationData={editAnimation} loop={false} className="w-6 h-6" />
    });

    setTimeout(() => navigate("/about"), 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-start justify-center pt-36 px-4">
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        newestOnTop
        limit={1}
      />
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl shadow-xl p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-indigo-200 flex items-center group transition-transform"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1" />
            Back
          </button>
          
          <div className="flex items-center">
            <Lottie
              animationData={editAnimation}
              loop={true}
              className="w-10 h-10"
            />
            <h1 className="text-xl font-semibold text-white ml-2">Edit Credentials</h1>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField 
            icon={<FaGlobe />}
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website URL"
            autoFocus
          />
          
          <InputField
            icon={<FaUser />}
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          
          <InputField
            icon={<FaLock />}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaSave className="text-lg" />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center bg-white/5 rounded-lg p-2 transition-colors hover:bg-white/10">
    <span className="text-white/80 mx-2">{icon}</span>
    <input
      {...props}
      className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm py-1.5"
    />
  </div>
);

export default Edit;