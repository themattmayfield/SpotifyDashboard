import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import Loading from "./Loading";
import Card from "./Card";
import RightSideBar from "./RightSideBar";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtists";

import { getUserInfo } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";
import RecentArtist from "./TopArtists";

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
    // console.log(user);
  }, []);

  return (
    <>
      <Layout>
        {topArtists && topTracksShort && topArtistsShort ? (
          <>
            <div className="flex">
              <div className="flex flex-col flex-1 overflow-x-hidden">
                <div className="flex flex-nowrap space-x-6 overflow-x-scroll">
                  {topArtists.items.map(
                    (item, index) => index < 16 && <Card key={index} info={item} />
                  )}
                </div>
                <div className="mt-14 mr-10 flex flex-nowrap overflow-x-scroll space-x-8">
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
