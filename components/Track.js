
export default function Track(props) {


    const millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }


    console.log(props.track);
    return (
        <div class="flex items-center justify-between">
<div class="flex space-x-6 items-center">
    <img className="w-20 h-20" src={props.track.track?.album.images[0].url ||props.track.album?.images[0].url} />
    <div className="flex flex-col">
        <p>{props.track.track?.name || props.track.name}</p>
        <div className="flex flex-col md:flex-row text-[#565656]">
        <p>{props.track.track?.artists[0].name || props.track.artists[0].name}</p> 
        <span className="hidden md:block">&nbsp;&middot;&nbsp;&nbsp;</span>
        <p>{props.track.track?.album.name || props.track.album.name}</p> 
        </div>
        <p className="md:hidden text-[#565656]">{millisToMinutesAndSeconds(JSON.stringify(props.track.track?.duration_ms || props.track.duration_ms))}</p>
    </div>
</div>



<div className="hidden md:block text-[#565656]">
    {millisToMinutesAndSeconds(JSON.stringify(props.track.track?.duration_ms || props.track.duration_ms))}
</div>

        </div>
    )
}