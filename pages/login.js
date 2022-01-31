import React, { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";

const Login = ({ providers }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-spotify-dark">
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-4xl text-white mb-6">Spotify Profile</h1>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full"
            >
              LOG IN TO SPOTIFY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
