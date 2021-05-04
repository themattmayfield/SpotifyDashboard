export default function Card(props) {
  return (
    <div className="inline-block max-w-min mx-auto ">
      <div
        style={{
          backgroundImage: `url(${props.info.images[1].url})`,
        }}
        className={`cursor-pointer rounded-3xl h-[60vw] w-[45vw] md:h-[40vw] md:w-[25vw] lg:h-[40vw] lg:w-[25vw] xl:h-96 xl:w-64 max-w-xs overflow-hidden bg-red-600 bg-cover bg-center flex items-center justify-center ${
          !props.profile &&
          "transition duration-300 ease-in-out transform hover:scale-105"
        }`}
      >
        <div
          className="opacity-0 hover:opacity-100 rounded-xl w-full h-full flex flex-col items-center justify-center transition duration-300 ease-in-out pl-2 pb-2 md:pl-6 md:pb-3"
          style={{ background: "rgba(0, 0, 0, 0.45)" }}
        >
          <div className="text-center text-4xl text-white">
            {props.info.name}
          </div>
        </div>
      </div>
    </div>
  );
}
