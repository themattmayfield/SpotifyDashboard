import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import Loading from "./Loading";
import Card from "./Card";
import RightSideBar from "./RightSideBar";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtists";

import { getUserInfo } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";

export default function Profile() {
  const [topArtists, setTopArtists] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);
  const [topTracksShort, setTopTracksShort] = useState(null);
  const [topArtistsShort, setTopArtistsShort] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const {
        topArtists,
        recentlyPlayed,
        topTracksShort,
        topArtistsShort
      } = await getUserInfo();          
      setTopArtists(topArtists);      
      setRecentlyPlayed(recentlyPlayed);
      setTopTracksShort(topTracksShort);
      setTopArtistsShort(topArtistsShort);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <>
      <Layout>
        {topArtists && topTracksShort && topArtistsShort ? (
          <>
            <div className="flex bg-transparent">
              <div className="flex flex-col overflow-x-hidden mr-4">
                <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar">
                  {topArtists.items.map(
                    (item, index) => index < 16 && <Card profile key={index} info={item} />
                  )}
                </div>
                <div className="mt-14 flex flex-nowrap overflow-x-scroll no-scrollbar space-x-8">
                <TopTracks topTracksShort={topTracksShort} />
                <TopArtists topArtistsShort={topArtistsShort} />
                </div>
              </div>

              {recentlyPlayed ? (
                <RightSideBar recentlyPlayed={recentlyPlayed} />
              ) : (
                <Loading />
              )}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </Layout>
    </>
  );
}
