require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB, getUsersCollection } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();


// Middleware


// Enable CORS for React dev server

app.use(cors());


app.use(express.json()); // Parse JSON bodies


// Connect MongoDB

connectDB();

// Signup Route

app.post("/signup", async (req, res) => {
  try {
    console.log("Signup request body:", req.body);
    const usersCollection = getUsersCollection();
    const { email, password } = req.body;

    const exists = await usersCollection.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, password: hash });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Login Route

app.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const usersCollection = getUsersCollection();
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Auth Middleware

function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ message: "Token required" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


// Profile Route (Protected)
app.get("/profile", auth, async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ email: user.email, id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
