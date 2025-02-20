'use client';

import Link from 'next/link';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-spotify-dark text-white">
      <h1 className="text-4xl font-bold mb-4">
        Oops! Looks like Matt's been coding again...
      </h1>
      <p className="text-lg mb-8">
        Don't worry, he's been notified and sent back to debugging school.
      </p>
      <div className="text-sm text-gray-400 mb-8">
        Error details (for the nerds): {error.message}
      </div>
      <Link
        href="/"
        className="tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full"
      >
        Take Me Home
      </Link>
    </div>
  );
}
