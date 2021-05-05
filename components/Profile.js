import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import Loading from "./Loading";
import Card from "./Card";
import RightSideBar from "./RightSideBar";
import Subtitle from "./Subtitle";
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
        topArtistsShort,
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
      <Layout profile>      
        {topArtists && topTracksShort && topArtistsShort ? (
          <>
            <div className="flex bg-transparent md:pr-6 md:pl-2 h-full">            
              <div className="flex flex-col overflow-x-hidden md:mr-4 md:pt-28 overflow-y-scroll mb-[100px] no-scrollbar h-full">
              <div className="md:hidden mb-16 px-2">
            {recentlyPlayed ? (
                <RightSideBar recentlyPlayed={recentlyPlayed} />
              ) : (
                <Loading />
              )}
            </div>  
            <div className="pl-2 pr-0 mb-16">
            <Subtitle link="/artists" subtitle="Recent Artist" />
                <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar pl-2 md:pl-0">                  
                  {topArtists.items.map(
                    (item, index) =>
                      index < 16 && <Card profile key={index} info={item} />
                  )}
                </div>
            </div>
                <div className="px-2 md:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8">
                  <TopTracks topTracksShort={topTracksShort} />
                  <TopArtists topArtistsShort={topArtistsShort} />
                </div>
              </div>

              {recentlyPlayed ? (
                <div className="hidden md:block">
                <RightSideBar recentlyPlayed={recentlyPlayed} />
                </div>
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
