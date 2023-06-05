import React from "react"

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <div 
      onClick={handlePlay}
    className="flex space-x-6 items-center cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray">
    <img className="w-20 h-20" src={track.albumUrl} />
    <div className="flex flex-col">
        <p className="text-white">{track.title}</p>
        <div className="flex flex-col md:flex-row text-[#565656]">
        <p>{track.artist}</p>         
    </div>
</div>
</div>

  )
}