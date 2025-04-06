import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser, FaLock, FaArrowLeft, FaSave } from "react-icons/fa";
import Lottie from "lottie-react";
import editAnimation from "../assets/shield-animation.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit = () => {
  // Extract the 'id' parameter from the URL and 'navigate' function from react-router
  const { id } = useParams();
  const navigate = useNavigate();

  // State to store form data for website, username, and password
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
  });

  const editUserData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/user/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // when id changes then re renders the page
  useEffect(() => {
    if (id) {
      editUserData(id);
    }
  }, [id]);

  // // Fetch and set form data from local storage when component mounts or 'id' changes
  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem("userLists")) || [];
  //   if (storedData[id]) {
  //     setFormData(storedData[id]); // Set form data if entry exists
  //   } else {
  //     toast.error("Entry not found!", { autoClose: 1000 }); // Show error if entry not found
  //     setTimeout(() => navigate("/about"), 1200); // Redirect after showing error
  //   }
  // }, [id, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if any form field is empty
    if (!formData.website || !formData.username || !formData.password) {
      toast.error("Please fill all fields!", {
        icon: <FaSave className="text-white" />,
      });
      return; // Exit function if validation fails
    }

    const response = await fetch(`http://localhost:3000/updateUser/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();

    // Show success toast notification
    if (data.message != "success") {
      toast.error("Please fill all fields!", {
        icon: <FaSave className="text-white" />,
      });
      return;
    }

    toast.success("Changes saved successfully!", {
      icon: (
        <Lottie
          animationData={editAnimation}
          loop={false}
          className="w-6 h-6"
        />
      ),
    });

    // Redirect to '/about' after a delay
    setTimeout(() => navigate("/about"), 1500);
  };

  // Handle input field changes and update form data state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Render the edit form
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-start justify-center pt-36 px-4">
      {/* 
        This is the container for the toast notifications that will appear at the top of the screen.
        The position is set to top-center, and the newest toast will be displayed first.
        The autoClose prop is set to 2000, which means that the toast will be automatically closed after 2 seconds.
        The limit prop is set to 1, which means that only one toast will be displayed at a time.
      */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        newestOnTop
        limit={1}
      />

      {/* 
        This is the main container for the edit form.
        The width is set to 100% of the parent container, and the maximum width is set to md (medium).
        The background color is set to a light gray color, and the backdrop blur is set to 1/4 of the screen.
        The rounded corners are set to 1/2 of the screen, and the shadow is set to a medium-sized box shadow.
        The padding is set to 6 pixels on all sides.
      */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl shadow-xl p-6">
        {/* 
          This is the header section of the edit form.
          It contains a back button and a title.
        */}
        <div className="flex items-center justify-between mb-6">
          {/* 
            This is the back button.
            When clicked, it will navigate back to the previous page.
          */}
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-indigo-200 flex items-center group transition-transform"
          >
            {/* 
              This is the icon for the back button.
              When the button is hovered, it will move slightly to the left.
            */}
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1" />
            {/* This is the text for the back button */}
            Back
          </button>

          {/* 
            This is the title of the edit form.
            It contains a Lottie animation and a heading element.
          */}
          <div className="flex items-center">
            {/* 
              This is the Lottie animation for the title.
              The animation is set to loop infinitely, and the size is set to 10x10 pixels.
            */}
            <Lottie
              animationData={editAnimation}
              loop={true}
              className="w-10 h-10"
            />
            {/* This is the heading element for the title */}
            <h1 className="text-xl font-semibold text-white ml-2">
              Edit Credentials
            </h1>
          </div>
        </div>

        {/* 
          This is the edit form with input fields and a save button.
        */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 
            This is the first input field for the website URL.
            The icon is set to a globe icon, and the placeholder text is set to "Website URL".
            The autoFocus prop is set to true, which means that the input field will be focused when the page is loaded.
          */}
          <InputField
            icon={<FaGlobe />}
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website URL"
            autoFocus
          />

          {/* 
            This is the second input field for the username.
            The icon is set to a user icon, and the placeholder text is set to "Username".
          */}
          <InputField
            icon={<FaUser />}
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />

          {/* 
            This is the third input field for the password.
            The icon is set to a lock icon, and the placeholder text is set to "Password".
            The type prop is set to "password", which means that the input field will be a password field.
          */}
          <InputField
            icon={<FaLock />}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />

          {/* 
            This is the save button.
            When clicked, it will submit the form and save the changes to local storage.
          */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {/* 
              This is the icon for the save button.
              It is a save icon.
            */}
            <FaSave className="text-lg" />
            {/* This is the text for the save button */}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center bg-white/5 rounded-lg p-2 transition-colors hover:bg-white/10">
    {/* 
      This is the icon that will be displayed at the start of the input field.
      It could be a FaGlobe for a website url, FaUser for a username, or FaLock for a password.
    */}
    <span className="text-white/80 mx-2">{icon}</span>
    {/* 
      This is the actual input element. We're spreading all the props that were passed to us
      onto this element, except for the icon, since we already handled that above.
    */}
    <input
      {...props}
      className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm py-1.5"
    />
  </div>
);

export default Edit;
