import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGlobe, FaUser, FaLock, FaArrowLeft, FaSave } from "react-icons/fa";
import Lottie from "lottie-react";
import editAnimation from "../assets/shield-animation.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { database, app } from "../firebaseConfig/config";
import { getAuth } from "firebase/auth";
import {
  query,
  doc,
  where,
  getDocs,
  getDoc,
  collection,
  updateDoc,
} from "firebase/firestore";

const Edit = () => {
  // Extract the 'id' parameter from the URL and 'navigate' function from react-router
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth(app);

  // console.log("Id is: ",id)

  // State to store form data for website, username, and password
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
  });

  useEffect(() => {}, [formData]);

  const editUserData = async () => {
    try {
      // get current user using auth
      const user = auth.currentUser;

      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Step 1: Get user doc ID using uid
      const q = query(
        collection(database, "passwordDB"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("User document not found!");
        return;
      }

      // get first doc which is actually user doc and that doc id
      const userDocId = querySnapshot.docs[0].id;

      // Step 2: Access userLists subcollection and get the doc directly by id
      // getting user userLists's using userDocId  which return ref to that doc
      const targetDocRef = doc(
        database,
        "passwordDB",
        userDocId,
        "userLists",
        id
      );

      // using getDoc will returns that ala data
      const targetDocSnap = await getDoc(targetDocRef);

      if (targetDocSnap.exists()) {
        // first we need to call .data() to get the data
        const data = targetDocSnap.data();
        setFormData({
          website: data.website || "",
          username: data.username || "",
          password: data.password || "",
        });
      } else {
        toast.error("Data not found!");
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Error fetching data");
    }
  };

  // when id changes then re renders the page
  useEffect(() => {
    if (id) {
      editUserData(id);
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.website || !formData.username || !formData.password) {
      toast.error("Please correct all fields!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    // get the ref of passwordDB collection
    const passwordDB = collection(database, "passwordDB");
    
    // make a query to check if the user exists
    const userExistQuery = query(
      passwordDB,
      where("uid", "==", auth.currentUser.uid)
    );

    // get the query snapshot 
    const querySnapShot = await getDocs(userExistQuery);

    // check if the query snapshot is empty and return error
    if (querySnapShot.empty) {
      toast.error("No user data found!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    // get the first doc from the query snapshot
    const userDoc = querySnapShot.docs[0];
    // get the doc id
    const userDocId = userDoc.id;

    // get the ref of userLists subcollection of current user 
    const userListRef = collection(
      database,
      "passwordDB",
      userDocId,
      "userLists"
    );
    // get the userLists snapshot of current user 
    const userListSnapShot = await getDocs(userListRef);

    // check if the userLists snapshot is empty and return error
    if (userListSnapShot.empty) {
      toast.error("No user data found!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    // get the first doc from the userLists snapshot whose id is equal to id and userDocID 
    const targetRef = doc(database, "passwordDB", userDocId, "userLists", id);

    // update the document 
    await updateDoc(targetRef, {
      website: formData.website,
      username: formData.username,
      password: formData.password,
      updatedAt: new Date(), // optional, for tracking
    });

    toast.success("Changes saved successfully!", {
      position: "top-center",
      hideProgressBar: true,
      theme: "colored",
    });
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
