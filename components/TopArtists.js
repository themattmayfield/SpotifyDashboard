import Subtitle from "./Subtitle";

export default function TopArtists(props) {
  return (
    <>
      <div className="flex flex-col max-w-min md:mx-auto">
      <Subtitle link="/artists" subtitle="Recent Artist" />
      <div className="space-y-3">
      <div className="flex space-x-3 items-center">
      <div style={{
            backgroundImage: `url(${props.topArtistsShort.items[0].images[0].url})`}}
            className="rounded-tl-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center">

</div>
<div style={{
            backgroundImage: `url(${props.topArtistsShort.items[1].images[0].url})`}}
            className="rounded-tr-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center">

</div>
      </div>
      <div className="flex space-x-3 items-center">
      <div style={{
            backgroundImage: `url(${props.topArtistsShort.items[2].images[0].url})`}}
            className="rounded-bl-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center">

</div>
<div style={{
            backgroundImage: `url(${props.topArtistsShort.items[3].images[0].url})`}}
            className="rounded-br-3xl rounded-lg h-[45vw] w-[45vw] md:h-[16vw] md:w-[16vw] xl:h-48 xl:w-48 bg-cover bg-center">

</div>
      </div>
      </div>
      </div>
      
    </>
  );
}
