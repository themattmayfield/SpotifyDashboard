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
      <div className="max-w-6xl mx-auto px-2 md:px-6">
      <div className="sticky top-0 bg-black w-full text-white pb-6 mb-4 select-none">
      <p className="text-2xl font-semibold">Recently Played Tracks</p>            
            
        </div>
        {recentlyPlayed ? (
          <div className="flex flex-col gap-4 no-scrollbar text-white">              
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
