import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Card from "components/Card";
import RightSideBar from "components/RightSideBar";
import Subtitle from "components/Subtitle";
import TopTracks from "components/TopTracks";
import TopArtists from "components/TopArtists";
import useSpotify from "lib/useSpotify";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

let parent = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const Loading = dynamic(() => import("components/Loading"), { ssr: false });

export default function Profile() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topTracksShort, setTopTracksShort] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topArtistsShort, setTopArtistsShort] = useState(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      (async () => {
        const { body: recentlyPlayed } =
          await spotifyApi.getMyRecentlyPlayedTracks({
            limit: 6,
          });

        const { body: topTracksShort } = await spotifyApi.getMyTopTracks({
          limit: 6,
          time_range: "short_term",
        });

        const { body: topArtists } = await spotifyApi.getMyTopArtists({
          limit: 16,
          time_range: "long_term",
        });

        const { body: topArtistsShort } = await spotifyApi.getMyTopArtists({
          limit: 4,
          time_range: "short_term",
        });

        setRecentlyPlayed(recentlyPlayed.items);
        setTopTracksShort(topTracksShort.items);
        setTopArtists(topArtists.items);
        setTopArtistsShort(topArtistsShort.items);
      })();
    }
  }, [session, spotifyApi]);

  return (
    <Layout profile>
      {/* {true ? ( */}
      {!recentlyPlayed || !topTracksShort || !topArtistsShort || !topArtists ? (
        <Loading />
      ) : (
        <motion.div
          variants={parent}
          initial="hidden"
          animate="show"
          className="flex bg-transparent lg:pr-6 lg:pl-2 h-full"
        >
          <div className="flex flex-col overflow-x-hidden lg:mr-4 overflow-y-scroll mb-[100px] no-scrollbar h-full">
            <div className="lg:hidden mb-16 px-2">
              <RightSideBar recentlyPlayed={recentlyPlayed} />
            </div>
            <div className="pl-2 pr-0 mb-16">
              <Subtitle link="/artists" subtitle="Top Artist" />
              <div className="flex flex-nowrap space-x-6 overflow-x-scroll no-scrollbar pl-2 lg:pl-0">
                {topArtists.map((item, index) => (
                  <Card profile key={index} info={item} />
                ))}
              </div>
            </div>
            <div className="px-2 lg:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8">
              <TopTracks topTracksShort={topTracksShort} />
              <TopArtists topArtistsShort={topArtistsShort} />
            </div>
          </div>
          <div className="hidden lg:block">
            <RightSideBar recentlyPlayed={recentlyPlayed} />
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
