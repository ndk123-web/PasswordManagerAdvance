import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { data, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { myContext } from "../contextprovider/sessionprovider.jsx"; // Import SessionContext
import "../loader.css"; // Import loader CSS

import { app, database } from "../firebaseConfig/config.js";
import {
  query,
  where,
  getDocs,
  collection,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

// This component renders a list of all the user's saved login credentials.
// It also allows the user to search for a specific login credential,
// edit an existing credential, or delete a credential.
const About = () => {
  // State variables
  const [userLists, setUserLists] = useState([]); // Local storage data
  const [searchTerm, setSearchTerm] = useState(""); // Search bar text
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Object to keep track of which passwords are visible
  const navigate = useNavigate(); // To navigate to edit route
  const { loader, setLoader } = useContext(myContext);
  const auth = getAuth(app);
  const [myLists, setMyLists] = useState({
    website: "",
    username: "",
    password: "",
  });

  const getUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      // 1. Find the document in "passwordDB" with current user's UID
      const passwordDBRef = collection(database, "passwordDB");
      const q = query(passwordDBRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No user data found.");
        return;
      }

      // 2. Get the doc ID
      const userDoc = querySnapshot.docs[0]; // assuming only one doc per uid
      const docId = userDoc.id;

      // 3. Now get the user's stored credentials inside userLists subcollection
      const userListsRef = collection(
        database,
        "passwordDB",
        docId,
        "userLists"
      );
      const userListsSnap = await getDocs(userListsRef);

      const data = userListsSnap.docs.map((doc) => ({
        _id: doc.id, // for delete/edit
        ...doc.data(),
      }));

      setUserLists(data);
      setLoader(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error(err.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      setLoader(false);
    }
  };

  // useEffect to fetch user data from Firestore when the component mounts.
  useEffect(() => {
    setLoader(true);
    getUserData();
  }, []);

  // This function toggles the visibility of a password based on the index.
  // togglePasswordVisibility function to toggle the visibility of passwords.
  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // This function deletes a user's login credential based on the index.
  // It sends a DELETE request to the backend to delete the user's credential.
  const handleDelete = async (uid) => {
    try {
      const passwordDB = collection(database, "passwordDB");
      const userExistQuery = query(
        passwordDB,
        where("uid", "==", auth.currentUser.uid) // ✅ fix 1
      );

      const querySnapShot = await getDocs(userExistQuery);

      if (querySnapShot.empty) {
        toast.error("Problem is There", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        return;
      }

      const userDoc = querySnapShot.docs[0];
      const userDocId = userDoc.id;

      // ✅ This is enough — no need to check subcollection snapshot
      const targetRef = doc(
        database,
        "passwordDB",
        userDocId,
        "userLists",
        uid // This should be the ID of the password entry to delete
      );

      await deleteDoc(targetRef);

      toast.success("Deleted successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });

      getUserData();

    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  // This function navigates to the edit route when the user clicks the edit icon.
  const handleEdit = (index) => {
    // When user clicks the edit icon, navigate to the edit route
    navigate(`/edit/${index}`);
  };

  // This function filters the userLists state array based on the searchTerm.
  // It returns a new array with only the items that match the searchTerm.
  const filteredLists = userLists.filter(
    (user) =>
      user.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-4">My Lists</h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          {/* Search icon */}
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          {/* Input field */}
          <input
            type="text"
            placeholder="Search Here By Any Name"
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px] whitespace-nowrap">
          {/* Table header */}

          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left">Website</th>
              <th className="py-4 px-6 text-left">Username</th>
              <th className="py-4 px-6 text-left">Password</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {/* loader indicator */}
            {loader && (
              <tr>
                <td colSpan="4" className="py-6 text-center">
                  <div className="flex justify-center items-center">
                    <span className="loader"></span>
                  </div>
                </td>
              </tr>
            )}

            {/* if no loader then show data */}
            {!loader &&
              filteredLists.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-indigo-50 transition-colors"
                >
                  {/* Website */}
                  <td className="py-3 px-6">{user.website}</td>
                  {/* Username */}
                  <td className="py-3 px-6">{user.username}</td>
                  {/* Password */}
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      {/* Password text */}
                      <span className="font-mono">
                        {visiblePasswords[index] ? user.password : "••••••••"}
                      </span>
                      {/* Eye icon */}
                      <button
                        onClick={() => togglePasswordVisibility(index)}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        {visiblePasswords[index] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </td>
                  {/* Action buttons */}
                  <td className="py-3 px-6">
                    <div className="flex justify-center items-center gap-4">
                      {/* Edit button */}
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-300 transform hover:scale-110"
                      >
                        <FaEdit className="text-xl" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-all duration-300 transform hover:scale-110"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default About;
