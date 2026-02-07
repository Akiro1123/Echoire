const trackTitle = document.getElementById("track-title");
const artistName = document.getElementById("artist-name");

let audio = new Audio();
let tracks = [];
let currentIndex = 0;

// Fetch top tracks from backend
async function loadTopTracks() {
  try {
    const res = await fetch("http://localhost:3000/top-tracks");
    tracks = await res.json();

    if (tracks.length > 0) {
      loadTrack(0);
    }
  } catch (err) {
    console.error("Error loading tracks:", err);
  }
}

// Load a track
function loadTrack(index) {
  if (!tracks[index] || !tracks[index].preview_url) {
    trackTitle.textContent = "No preview available";
    artistName.textContent = "";
    return;
  }

  currentIndex = index;
  audio.src = tracks[index].preview_url;

  trackTitle.textContent = tracks[index].name;
  artistName.textContent = tracks[index].artists;
}

// Player controls
function play() {
  audio.play();
}

function pause() {
  audio.pause();
}

function next() {
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
  play();
}

function previous() {
  currentIndex =
    (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentIndex);
  play();
}

// Auto-play next when preview ends
audio.addEventListener("ended", next);

// Load tracks on page load
window.onload = loadTopTracks;
