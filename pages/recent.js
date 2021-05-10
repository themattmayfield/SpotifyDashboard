import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Track from "../components/Track"

import { getRecentlyPlayed } from "../lib/spotifyHelper";

import { catchErrors } from "../utils";


export default function Recent() {
    const [recentlyPlayed, setRecentlyPlayed] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getRecentlyPlayed();
      setRecentlyPlayed(data);
    };
    catchErrors(fetchData());
  }, []);

  return (
    <>
      <Layout> 
      <div className="max-w-6xl mx-auto px-2 md:px-6 pt-4 md:pt-24">
      <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
      <p className="text-2xl font-semibold">Recently Played Tracks</p>            
            
        </div>
        {recentlyPlayed ? (
          <div className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]">              
            {recentlyPlayed.items.map((track, index) => (
              <Track track={track} />
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
