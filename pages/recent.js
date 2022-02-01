import React, { useState, useEffect } from "react";
import Layout from "components/Layout";
import Track from "components/Track";
import { catchErrors } from "utils";
import useSpotify from "lib/useSpotify";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
const Loading = dynamic(() => import("components/Loading"), { ssr: false });

let parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Recent() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [recentlyPlayed, setRecentlyPlayed] = useState(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      (async () => {
        const { body } = await spotifyApi.getMyRecentlyPlayedTracks();

        setRecentlyPlayed(body.items);
      })();
    }
  }, [session, spotifyApi]);

  if (!recentlyPlayed) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="max-w-6xl mx-auto px-2 md:px-6 pt-10 md:pt-24">
          <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
            <p className="text-2xl font-semibold">Recently Played Tracks</p>
          </div>

          <motion.div
            variants={parent}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]"
          >
            {recentlyPlayed.map((track, index) => (
              <Track key={index} track={track} />
            ))}
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
