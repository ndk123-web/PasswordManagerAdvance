import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { Password } from "./api/password.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE","PUT"],
    credentials: false,
  })
);
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/PasswordManager");

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.post("/add", async (req, res) => {
  try {
    const { website, username, password } = req.body;
    if (!website || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } else {
      const newEntry = new Password({
        website,
        username,
        password,
      });
      await newEntry.save();
      return res.status(201).json({ user: newEntry });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/userLists", async (req, res) => {
  res.setHeader("Contet-Type", "application/json");
  try {
    const users = await Password.find(
      {},
      { website: 1, username: 1, password: 1, _id: 1 }
    );
    res.json(users);
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Password.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/delete", async (req, res) => {
  const { index } = req.body;
  try {
    const isDeleted = await Password.findByIdAndDelete(index);
    isDeleted
      ? res.status(200).json({ message: "Deleted Successfully" })
      : res.status(404).json({ message: "Not Found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  const { id } = req.params;
  const { website, username, password } = req.body;

  try {
    if ((!website, !password, !username)) {
      return res.json({ message: "Failed" });
    }
    const newUser = await Password.findByIdAndUpdate(
      id,
      {
        website,
        username,
        password,
      },
      { new: true }
    );

    if (!newUser) {
      return res.json({ message: "There is Not Available" });
    }
    return res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Internal Server Error" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is Running on Port 3000");
});
