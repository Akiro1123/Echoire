const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ===== FILE STORAGE SETUP =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// SONG DATABASE (temporary memory storage)
let songs = [];

// ===== UPLOAD ENDPOINT =====
app.post("/upload", upload.single("song"), (req, res) => {
  const { title, artist } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const newSong = {
    id: Date.now(),
    title,
    artist,
    file: req.file.filename,
    url: `http://localhost:3000/uploads/${req.file.filename}`
  };

  songs.push(newSong);

  res.json({ message: "Song uploaded", song: newSong });
});

// ===== GET SONGS =====
app.get("/songs", (req, res) => {
  res.json(songs);
});

// ===== STREAM FILES =====
app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
  console.log("Echoire backend running on port 3000");
});
