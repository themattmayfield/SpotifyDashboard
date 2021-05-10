import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

import { token } from "../lib/spotifyHelper";


export default function Player({ trackUri }) {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])

  if (!token) return null
  return (
    <SpotifyPlayer  
    autoPlay  
      token={token}
      persistDeviceSelection
      initialVolume=".75"
      magnifySliderOnHover
      syncExternalDevice
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}

      styles={{
        bgColor: '#000',
        sliderColor: '#68868',
      }}
    />
  )
}