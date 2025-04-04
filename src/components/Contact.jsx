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
  // This function is called when the form is submitted
  // It will display a success toast notification
  // and reset the form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Display a success toast notification
    // with the message "Message sent successfully!"
    // The notification will be displayed at the top center
    // and will automatically close after 2000ms
    // The theme of the notification will be set to "colored"
    toast.success("Message sent successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });

    // Reset the form
    e.target.reset();
  };

  // Return the JSX for the Contact page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      {/* Toast container to display the success notification */}
      <ToastContainer />

      {/* Main container for the Contact page */}
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 flex flex-col md:flex-row gap-8">
        {/* Left section - Animation & Info */}
        <div className="md:w-1/2 space-y-8">
          {/* Container for the animation and info */}
          <div className="flex flex-col items-center">
            {/* Lottie animation */}
            <Lottie
              animationData={contactAnimation}
              loop={true}
              className="w-64 h-64"
            />

            {/* Heading with the text "Let's Connect!" */}
            <h1 className="text-3xl font-bold text-white mt-4">
              Let's Connect!
            </h1>
          </div>

          {/* Container for the contact info */}
          <div className="space-y-6 text-white">
            {/* Phone number */}
            <div className="flex items-center gap-4">
              {/* Phone icon */}
              <FaPhone className="text-2xl text-emerald-400" />

              {/* Phone number and label */}
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            {/* Email address */}
            <div className="flex items-center gap-4">
              {/* Email icon */}
              <FaEnvelope className="text-2xl text-cyan-400" />

              {/* Email address and label */}
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>support@passop.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4">
              {/* Map marker icon */}
              <FaMapMarkerAlt className="text-2xl text-amber-400" />

              {/* Address and label */}
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Contact form */}
        <div className="md:w-1/2 bg-white/5 rounded-xl p-6 backdrop-blur-sm">
          {/* Form container */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full name field */}
            <div>
              {/* Label for the full name field */}
              <label className="text-white/80 block mb-2">Full Name</label>

              {/* Full name input field */}
              <input
                type="text"
                required
                className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Email field */}
            <div>
              {/* Label for the email field */}
              <label className="text-white/80 block mb-2">Email</label>

              {/* Email input field */}
              <input
                type="email"
                required
                className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Message field */}
            <div>
              {/* Label for the message field */}
              <label className="text-white/80 block mb-2">Message</label>

              {/* Message text area */}
              <textarea
                rows="5"
                required
                className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              ></textarea>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {/* Paper plane icon */}
              <FaPaperPlane className="text-lg" />

              {/* Text for the submit button */}
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
