const express = require("express");
const multer = require("multer");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");
const path = require("path");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload Image (Admin Only)
router.post("/upload", authenticate, isAdmin, upload.single("image"), (req, res) => {
  res.json({ message: "Image uploaded successfully", filePath: `/public/uploads/${req.file.filename}` });
});

// Get All Images
router.get("/", authenticate, (req, res) => {
  const fs = require("fs");
  const dirPath = path.join(__dirname, "../public/uploads");
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ message: "Unable to read images" });
    res.json(files.map((file) => ({ filename: file, url: `/public/uploads/${file}` })));
  });
});

// Download Image
router.get("/download/:filename", authenticate, (req, res) => {
  const filePath = path.join(__dirname, "../public/uploads", req.params.filename);
  res.download(filePath);
});

module.exports = router;
