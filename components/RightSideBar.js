export default function RightSideBar(props) {
  return (
    <div className="h-full rounded-3xl bg-custom-darkgray pt-6 pb-4 w-80 text-white">
      <p className="text-xl mb-6 pl-8">Recently Played</p>
      <div className="pl-8 pr-1">
      {props.recentlyPlayed ? (
        <div className="flex flex-col space-y-8">
          {props.recentlyPlayed.items.map((item, index) => (
            index < 6 && 
            <div 
            key={index}
            className="flex">
            <div className="mr-4">
              <div
                className="rounded-full bg-cover bg-center w-16 h-16"
                style={{
                  backgroundImage: `url(${item.track.album.images[0].url})`,
                }}
              ></div>
            </div>

            <div>
              <div className="overflow-hidden truncate w-48">{item.track.artists[0].name}</div>
              <p className="text-xs text-[#565656] overflow-hidden truncate w-48">{item.track.name}</p>
            </div>
          </div>
          ))}
        </div>
      ) : (
        <p>Loading</p>
      )}
      </div>

      <div className="w-full px-8 mt-6">
          <button className="bg-[#383838] text-sm rounded-3xl px-4 py-4 w-full">View All</button>
      </div>
    </div>
  );
}
