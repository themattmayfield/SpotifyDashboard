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
      <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4">
      <div className="z-20 sticky top-0 bg-black w-full text-white pb-6 mb-4 select-none flex items-center justify-between">
            <div>
                <p className="text-2xl font-semibold">Your Playlists</p>
            </div>                
            
        </div>
        {playlists ? (          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 no-scrollbar">              
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
