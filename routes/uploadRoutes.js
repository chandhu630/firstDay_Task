const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateUser, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Ensure Upload Directory Exists
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Admin-Only Image Upload
router.post("/upload", authenticateUser, authorizeAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(201).json({ message: "Image uploaded successfully", filePath: `/uploads/${req.file.filename}` });
});

// ✅ Get All Uploaded Images (Visible to Admin & Users)
router.get("/images", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving images" });
    }
    res.json({ images: files.map(file => `/uploads/${file}`) });
  });
});

module.exports = router;
