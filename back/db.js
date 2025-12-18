const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let usersCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("jwtmini");
    usersCollection = db.collection("users");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// Getter for collection
function getUsersCollection() {
  return usersCollection;
}

module.exports = { connectDB, getUsersCollection };
