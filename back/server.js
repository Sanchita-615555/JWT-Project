require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB, getUsersCollection } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/signup", async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const { email, password } = req.body;

    const exists = await usersCollection.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, password: hash });

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(403).json({ message: "Token required" });

  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/profile", auth, async (req, res) => {
  const usersCollection = getUsersCollection();
  const user = await usersCollection.findOne({
    _id: new ObjectId(req.user.id),
  });

  res.json({ email: user.email, id: user._id });
});

// ✅ IMPORTANT PART (Render fix)
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err);
  });
