import SpotifyWebApi from "spotify-web-api-node";

const scope = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read",
  "user-follow-read",
  "user-follow-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(",");

const params = {
  scope: scope,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
