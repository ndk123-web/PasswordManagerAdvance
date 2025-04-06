import express from "express"; // Import express module
import cors from "cors"; // Import cors module for handling CORS
import mongoose from "mongoose"; // Import mongoose for MongoDB interactions

import { Password } from "./api/password.js"; // Import Password model

const app = express(); // Create an instance of express

// Use CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "DELETE", "PUT"], // Allow these HTTP methods
    credentials: false, // Do not use credentials
  })
);
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB using mongoose
mongoose.connect("mongodb://localhost:27017/PasswordManager");

// Define a GET route for the root path
app.get("/", (req, res) => {
  res.json({ message: "Hello World" }); // Send a simple JSON response
});

// Define a POST route to add a new password entry
app.post("/add", async (req, res) => {
  try {
    const { website, username, password } = req.body; // Destructure request body
    if (!website || !username || !password) {
      // Check if any field is missing
      return res.status(400).json({ message: "All fields are required" });
    } else {
      const newEntry = new Password({
        website,
        username,
        password,
      }); // Create a new Password document
      await newEntry.save(); // Save the document to the database
      return res.status(201).json({ user: newEntry }); // Respond with the new entry
    }
  } catch (err) {
    console.error(err); // Log any error
    return res.status(500).json({ message: "Internal Server Error" }); // Respond with error
  }
});

// Define a GET route to fetch all user lists
app.get("/userLists", async (req, res) => {
  res.setHeader("Content-Type", "application/json"); // Set the content type of the response
  try {
    const users = await Password.find(
      {},
      { website: 1, username: 1, password: 1, _id: 1 }
    ); // Fetch users with selected fields
    res.json(users); // Respond with the list of users
  } catch (err) {
    console.log(err); // Log any error
  }
});

// Define a GET route to fetch user by ID
app.get("/user/:id", async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters
  try {
    const user = await Password.findById(id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // User not found
    }
    console.log(user); // Log the found user
    res.json(user); // Respond with the user data
  } catch (err) {
    console.log(err); // Log any error
    res.status(500).json({ message: "Internal Server Error" }); // Respond with error
  }
});

// Define a DELETE route to delete user by index
app.delete("/delete", async (req, res) => {
  const { index } = req.body; // Extract index from request body
  try {
    const isDeleted = await Password.findByIdAndDelete(index); // Delete user by index
    isDeleted
      ? res.status(200).json({ message: "Deleted Successfully" }) // Successfully deleted
      : res.status(404).json({ message: "Not Found" }); // User not found
  } catch (err) {
    console.log(err); // Log any error
    res.status(500).json({ message: "Internal Server Error" }); // Respond with error
  }
});

// Define a PUT route to update user by ID
app.put("/updateUser/:id", async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters
  const { website, username, password } = req.body; // Destructure request body

  try {
    if (!website || !username || !password) {
      // Check if any field is missing
      return res.json({ message: "Failed" });
    }
    const newUser = await Password.findByIdAndUpdate(
      id,
      {
        website,
        username,
        password,
      },
      { new: true } // Return the updated document
    );

    if (!newUser) {
      return res.json({ message: "There is Not Available" }); // User not available
    }
    return res.json({ message: "success" }); // Successfully updated
  } catch (err) {
    console.log(err); // Log any error
    return res.json({ message: "Internal Server Error" }); // Respond with error
  }
});

// Start the express server on port 3000
app.listen(3000, "0.0.0.0", () => {
  console.log("Server is Running on Port 3000"); // Log server running message
});

