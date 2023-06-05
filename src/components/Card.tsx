'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

let card = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function Card({
  info,
  profile,
}: {
  info: any;
  profile?: boolean;
}) {
  return (
    <motion.div variants={card} className="inline-block max-w-min mx-auto ">
      <Link href={`/artists/${info.id}`}>
        <div
          style={{
            backgroundImage: `url(${info.images[1].url})`,
          }}
          className={`cursor-pointer rounded-3xl h-[60vw] w-[45vw] md:h-[40vw] md:w-[25vw] lg:h-[40vw] lg:w-[25vw] xl:h-96 xl:w-64 max-w-xs overflow-hidden bg-custom-darkgray bg-cover bg-center flex items-center justify-center ${
            !profile &&
            'transition duration-300 ease-in-out transform hover:scale-105'
          }`}
        >
          <div
            className="opacity-0 hover:opacity-100 rounded-xl w-full h-full flex flex-col items-center justify-center transition duration-300 ease-in-out pl-2 pb-2 md:pl-6 md:pb-3"
            style={{ background: 'rgba(0, 0, 0, 0.45)' }}
          >
            <div className="text-center text-2xl md:text-4xl text-white">
              {info.name}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
