const uploadForm = document.getElementById("uploadForm");
const uploadStatus = document.getElementById("uploadStatus");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("songTitle").value);
  formData.append("artist", document.getElementById("songArtist").value);
  formData.append("song", document.getElementById("songFile").files[0]);

  uploadStatus.textContent = "Uploading...";

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData
    });

    await res.json();
    uploadStatus.textContent = "Upload successful 🎵";

  } catch (err) {
    uploadStatus.textContent = "Upload failed";
  }
});
