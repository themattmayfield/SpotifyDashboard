import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ trackUri, token }) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!token) return null;
  return (
    <SpotifyPlayer
      autoPlay={true}
      token={token}
      persistDeviceSelection
      initialVolume=".75"
      magnifySliderOnHover
      syncExternalDevice
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
      styles={{
        bgColor: "#000",
        sliderColor: "#68868",
      }}
    />
  );
}
