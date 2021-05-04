// import Link from "next/link";

export default function Playlist(props) {
  console.log(props.playlist);
    return (
      
       <div className="inline-block max-w-min">
      <div
        style={{
          backgroundImage: `url(${props.playlist.images[0].url})`,
        }}
        className={`cursor-pointer h-52 w-52 max-w-xs overflow-hidden bg-red-600 bg-cover bg-center flex items-center justify-center ${
          !props.profile &&
          "transition duration-300 ease-in-out transform hover:scale-105"
        }`}
      >
        
      </div>
      <div className="text-center mt-4">
        <p className="text-white">{props.playlist.name}</p>
        <p className="text-xs text-[#565656] break-words">{props.playlist.tracks.total} TRACKS</p>
      </div>
    </div>
      
    );
  };