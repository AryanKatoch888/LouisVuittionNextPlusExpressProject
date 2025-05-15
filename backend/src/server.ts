// backend/src/server.ts
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Image upload route
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

// Image delete route
app.delete("/api/delete/:imageName", (req, res) => {
  const fs = require("fs");
  const imagePath = path.join(__dirname, "uploads", req.params.imageName);
  fs.unlink(imagePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting image" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

// Serve static files from "uploads" folder
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
