import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [userLists, setUserLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userLists")) || [];
    setUserLists(storedData);
  }, []);

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = (index) => {
    const updatedUserLists = userLists.filter((_, i) => i !== index);
    setUserLists(updatedUserLists);
    localStorage.setItem("userLists", JSON.stringify(updatedUserLists));
  };

  const handleEdit = (index) => {
    navigate(`/edit/${index}`);
  };

  const filteredLists = userLists.filter(
    (user) =>
      user.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-4">My Lists</h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left">Website</th>
              <th className="py-4 px-6 text-left">Username</th>
              <th className="py-4 px-6 text-left">Password</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLists.map((user, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-200 hover:bg-indigo-50 transition-colors"
              >
                <td className="py-3 px-6">{user.website}</td>
                <td className="py-3 px-6">{user.username}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {visiblePasswords[index] ? user.password : "••••••••"}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(index)}
                      className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      {visiblePasswords[index] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex justify-center items-center gap-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-300 transform hover:scale-110"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(index)}
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