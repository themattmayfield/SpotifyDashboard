import Link from "next/link";

export default function Subtitle({ subtitle, link }) {
  return (
    <div className="flex justify-between w-full">
      <p className="mb-5 md:text-xl lg:text-2xl text-white">{subtitle}</p>
      <Link href={link}>
        <button className="focus:outline-none text-white whitespace-nowrap text-xs text-nowrap hover:bg-[#383838] transition duration-150 ease-in-out rounded-full px-4 h-[36px] border border-[#383838]">
          See All
        </button>
      </Link>
    </div>
  );
}
