console.log("Echoire script loaded");

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PLAYER ELEMENTS
  ==========================*/
  const trackTitle = document.getElementById("track-title");
  const artistName = document.getElementById("artist-name");
  const audio = document.getElementById("audioPlayer");
  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const coverEl = document.getElementById("trackCover");
  const volume = document.getElementById("volume");

  /* =========================
     UI ELEMENTS
  ==========================*/
  const songGrid = document.getElementById("songGrid");
  const recentGrid = document.getElementById("recentGrid");

  /* =========================
     PROFILE MENU
  ==========================*/
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const uploadNav = document.getElementById("uploadNav");

  /* =========================
     USER ROLE (temporary)
  ==========================*/
  const currentUser = {
    name: "James Justhin",
    role: "artist"
  };

  /* =========================
     PROFILE DROPDOWN
  ==========================*/
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
        profileMenu.classList.remove("show");
      }
    });
  }

  /* =========================
     NAVIGATE TO UPLOAD PAGE
  ==========================*/
  if (uploadNav) {
    uploadNav.addEventListener("click", () => {
      window.location.href = "upload.html";
    });
  }

  /* =========================
     MUSIC DATA
  ==========================*/
  let tracks = [];
  let currentIndex = 0;

  /* =========================
     LOAD SONGS FROM BACKEND
  ==========================*/
  async function loadSongsFromBackend() {
    try {
      const res = await fetch("http://localhost:3000/songs");
      const songs = await res.json();

      tracks = songs.map(song => ({
        name: song.title,
        artists: song.artist,
        preview_url: `http://localhost:3000/stream/${song.filename}`,
        image: ""
      }));

      displaySongs(tracks);

    } catch (err) {
      console.error("Failed to load songs:", err);
    }
  }

  /* =========================
     DISPLAY SONG CARDS
  ==========================*/
  function displaySongs(trackList) {
    if (!songGrid) return;

    songGrid.innerHTML = "";

    trackList.forEach((track, index) => {
      const card = document.createElement("div");
      card.className = "song-card";
      card.dataset.index = index;

      card.innerHTML = `
        <img src="${track.image || ''}">
        <h3>${track.name}</h3>
        <p>${track.artists}</p>
      `;

      songGrid.appendChild(card);
    });
  }

  /* =========================
     LOAD TRACK INTO PLAYER
  ==========================*/
  function loadTrack(index) {
    if (!tracks[index] || !audio) return;

    currentIndex = index;
    audio.src = tracks[index].preview_url;

    if (trackTitle) trackTitle.textContent = tracks[index].name;
    if (artistName) artistName.textContent = tracks[index].artists;
    if (coverEl) coverEl.src = tracks[index].image || "";
  }

  /* =========================
     PLAY / PAUSE
  ==========================*/
  if (playBtn && audio) {
    playBtn.addEventListener("click", async () => {
      try {
        if (!audio.src) return;

        if (audio.paused) {
          await audio.play();
          playBtn.textContent = "❚❚";
        } else {
          audio.pause();
          playBtn.textContent = "▶";
        }
      } catch (err) {
        console.log("Playback failed:", err);
      }
    });
  }

  /* =========================
     PREV / NEXT
  ==========================*/
  if (prevBtn && audio) {
    prevBtn.addEventListener("click", () => {
      if (!tracks.length) return;
      currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      loadTrack(currentIndex);
      audio.play();
    });
  }

  if (nextBtn && audio) {
    nextBtn.addEventListener("click", () => {
      if (!tracks.length) return;
      currentIndex = (currentIndex + 1) % tracks.length;
      loadTrack(currentIndex);
      audio.play();
    });
  }

  /* =========================
     PROGRESS BAR
  ==========================*/
  if (audio && progressBar) {
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      progressBar.value = (audio.currentTime / audio.duration) * 100;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    progressBar.addEventListener("input", () => {
      if (!audio.duration) return;
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
  }

  /* =========================
     DURATION
  ==========================*/
  if (audio) {
    audio.addEventListener("loadedmetadata", () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("ended", () => {
      if (playBtn) playBtn.textContent = "▶";
    });
  }

  /* =========================
     VOLUME
  ==========================*/
  if (volume && audio) {
    volume.addEventListener("input", () => {
      audio.volume = volume.value;
    });
  }

  /* =========================
     CLICK SONG CARD TO PLAY
  ==========================*/
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".song-card");
    if (!card) return;

    const index = Number(card.dataset.index);
    if (isNaN(index)) return;

    loadTrack(index);

    audio.play().then(() => {
      if (playBtn) playBtn.textContent = "❚❚";
    });
  });

  /* =========================
     TIME FORMAT
  ==========================*/
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  /* =========================
     INITIAL LOAD
  ==========================*/
  loadSongsFromBackend();

});
