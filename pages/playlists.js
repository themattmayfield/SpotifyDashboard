import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Playlist from "components/Playlist";
import { catchErrors } from "utils";
import useSpotify from "lib/useSpotify";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const Loading = dynamic(() => import("components/Loading"), { ssr: false });

export default function Playlists() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      (async () => {
        const { body } = await spotifyApi.getUserPlaylists();

        setPlaylists(body.items);
      })();
    }
  }, [session, spotifyApi]);

  if (!playlists) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-24">
          <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
            <div>
              <p className="text-2xl font-semibold">Your Playlists</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 no-scrollbar mb-[100px]">
            {playlists.map((playlist, index) => (
              <Playlist key={index} playlist={playlist} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
