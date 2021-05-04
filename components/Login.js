import React, { useState, useEffect } from "react";
import Link from "next/link";
// import { LOGIN_URI } from "../lib/spotifyHelper";
let LOGIN_URI = process.env.NEXT_LOGIN_URI

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-spotify-dark">
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-4xl text-white mb-6">Spotify Profile</h1>
        <Link href={LOGIN_URI}>
          <a className="tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full">
            LOG IN TO SPOTIFY
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
