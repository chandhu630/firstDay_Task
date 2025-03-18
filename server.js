require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// Function to Connect to MongoDB (without extra options)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

//  Call the function to connect to DB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/public", express.static("public")); // Serve images

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
