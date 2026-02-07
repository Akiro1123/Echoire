import fetch from "node-fetch";

// ⚠️ TEMPORARY TOKEN (expires in 1 hour)
const SPOTIFY_TOKEN =
  'BQDrNqFjTekOSia9CmyJTmNlUsX4HcopXJq7a1p2wbd-qy56aoYHWaKu6kc2dVbB_WsqWQLegJA4dLDmdE233AA3IeLtbCa4J5aqJLuHidSKPuf39tBx9tDNEQcOTMoamuooafQ9op7r0QCfXuMgcpjUv1mKyUF0iMijL0ksVCMxDrECaABH8McalJsoXoG3y-Zeok8DF1hC9MMiMObznyoXLaJ6VdStPmyBxYXPwl6YSx6AIw-Wh1KbPPD7ElnvOP1DkXGBDBUzS_dYdsOg-W6koT_ZVEd7sygWzJt6Cr64c-Vr3HP-3m_qOcCNzKr47UhA'

// Generic Spotify API fetch
async function fetchSpotify(endpoint) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${SPOTIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Spotify API error");
  }

  return await res.json();
}

// Exported function
export async function getTopTracks() {
  const data = await fetchSpotify(
    "v1/me/top/tracks?time_range=long_term&limit=10"
  );

  return data.items.map(track => ({
    name: track.name,
    artists: track.artists.map(a => a.name).join(", "),
    album: track.album.name,
    preview_url: track.preview_url,
    image: track.album.images[0]?.url,
  }));
}
