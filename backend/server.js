import express from "express";
import cors from "cors";
import { getTopTracks } from "./spotify.js";

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint
app.get("/top-tracks", async (req, res) => {
  try {
    const tracks = await getTopTracks();
    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

app.listen(3000, () => {
  console.log("🎧 Spotify API Server running at http://localhost:3000");
});
