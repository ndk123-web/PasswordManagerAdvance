import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const About = () => {
  // State variables
  const [userLists, setUserLists] = useState([]); // Local storage data
  const [searchTerm, setSearchTerm] = useState(""); // Search bar text
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Object to keep track of which passwords are visible
  const navigate = useNavigate(); // To navigate to edit route

  const getUserData = async () => {
    const response = await fetch("http://localhost:3000/userLists");
    const data = await response.json();
    setUserLists(data);
  };

  useEffect(() => {
    // When component mounts, get data from local storage
    getUserData();
  }, [userLists]);

  const togglePasswordVisibility = (index) => {
    // When user clicks the eye icon, toggle the password visibility
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = async (index) => {
    // When user clicks the trash icon, filter out the item at the given index
    const deleteUser = await fetch("http://localhost:3000/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index }),
    });
  };

  const handleEdit = (index) => {
    // When user clicks the edit icon, navigate to the edit route
    navigate(`/edit/${index}`);
  };

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
            {filteredLists.map((user, index) => (
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
