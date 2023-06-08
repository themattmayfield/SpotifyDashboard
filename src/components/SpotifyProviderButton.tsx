'use client';

import { signIn } from 'next-auth/react';
import React from 'react';

const SpotifyProviderButton = () => {
  return (
    <button
      onClick={() => signIn('spotify', { callbackUrl: '/', redirect: true })}
      className="tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full"
    >
      LOG IN TO SPOTIFY
    </button>
  );
};

export default SpotifyProviderButton;
