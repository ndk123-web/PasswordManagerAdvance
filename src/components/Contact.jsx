import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import Lottie from "lottie-react";
import contactAnimation from "../assets/contact-animation.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <ToastContainer />

      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 flex flex-col md:flex-row gap-8">
        {/* Left Section - Animation & Info */}
        <div className="md:w-1/2 space-y-8">
          <div className="flex flex-col items-center">
            <Lottie
              animationData={contactAnimation}
              loop={true}
              className="w-64 h-64"
            />
            <h1 className="text-3xl font-bold text-white mt-4">
              Let's Connect!
            </h1>
          </div>

          <div className="space-y-6 text-white">
            <div className="flex items-center gap-4">
              <FaPhone className="text-2xl text-emerald-400" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-2xl text-cyan-400" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>support@passop.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-2xl text-amber-400" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="md:w-1/2 bg-white/5 rounded-xl p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white/80 block mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="text-white/80 block mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-white/80 block mb-2">Message</label>
              <textarea
                rows="5"
                required
                className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <FaPaperPlane className="text-lg" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
