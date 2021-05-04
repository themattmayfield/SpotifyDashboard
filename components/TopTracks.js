import Subtitle from './Subtitle'

export default function TopTracks(props) {
  return (
      <>
      <div>
      <Subtitle link="/tracks" subtitle="Top Tracks of the Week" />
    <div className="rounded-3xl p-8 text-white bg-custom-darkgray2 w-[600px]">
      <div className="space-y-10">
      {props.topTracksShort.items.map((item, index) => (
        index < 6 && 
        <div 
        key={index}
        className="flex justify-between">
          <div className="flex items-center space-x-4">
            <img
              className="w-20 h-20 "
              src={item.album.images[0].url}
            ></img>
            <div className="flex flex-col">
        <p className="text-xl">{item.name}</p>
        <p className="text-sm text-[#B6B6B6]">{item.album.name}</p>
          </div>
          </div>

          <div>
something
              </div>
        </div>
      ))}
      </div>
    </div>
      </div>
    </>
  );
}
