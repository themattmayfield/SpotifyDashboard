import Link from 'next/link'

export default function Track({ track }) {
  // function handlePlay() {
  //   chooseTrack(track)
  // }

  const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };
  return (
    <div 
    // onClick={handlePlay}
    class="flex items-center justify-between  cursor-pointer transition duration-150 ease-in-out hover:bg-custom-darkgray">
      <div class="flex space-x-6 items-center">
        <img
          className="w-20 h-20"
          src={
            track.track?.album.images[0].url ||
            track.album?.images[0].url
          }
        />
        <div className="flex flex-col">
          <p>{track.track?.name || track.name}</p>
          <div className="flex flex-col md:flex-row text-[#565656]">
          <Link href={`/artist/?id=${track.track?.artists[0].id || track.artists[0].id}`}>
            <p>
              {track.track?.artists[0].name ||
                track.artists[0].name}
            </p>
            </Link>
            <span className="hidden md:block">&nbsp;&middot;&nbsp;&nbsp;</span>
            <p>{track.track?.album.name || track.album.name}</p>
          </div>
          <p className="md:hidden text-[#565656]">
            {millisToMinutesAndSeconds(
              JSON.stringify(
                track.track?.duration_ms || track.duration_ms
              )
            )}
          </p>
        </div>
      </div>

      <div className="hidden md:block text-[#565656]">
        {millisToMinutesAndSeconds(
          JSON.stringify(
            track.track?.duration_ms || track.duration_ms
          )
        )}
      </div>
    </div>
  );
}
