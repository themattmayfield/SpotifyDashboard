import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Playlist from "../components/Playlist";

import { getPlaylists } from "../lib/spotifyHelper";

import { catchErrors } from "../utils";


export default function Playlists() {
    const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylists();
      setPlaylists(data);
    };
    catchErrors(fetchData());
  }, []);

  return (
    <>
      <Layout>
      <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-12 md:pt-24">
      <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
            <div>
                <p className="text-2xl font-semibold">Your Playlists</p>
            </div>                
            
        </div>
        {playlists ? (          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 no-scrollbar mb-[100px]">              
          {playlists.items.map((playlist, index) => (
            <Playlist key={index} playlist={playlist} />
          ))}
        </div>
        ) : (
          <Loading />
        )}
        </div>
      </Layout>
    </>
  );
}
