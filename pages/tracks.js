import React, { useState, useEffect } from "react";
import useSpotify from "lib/useSpotify";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import Track from "../components/Track";
import { catchErrors } from "../utils";
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

const classes = {
  active: "border-b border-white",
  inactive: "border-b border-transparent",
};

export default function Tracks() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState("long");

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      (async () => {
        const { body } = await spotifyApi.getMyTopTracks({
          limit: 50,
          time_range: "long_term",
        });

        setTopTracks(body.items);
      })();
    }
  }, [session, spotifyApi]);

  const apiCalls = {
    long: () =>
      spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: "long_term",
      }),
    medium: () =>
      spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: "medium_term",
      }),
    short: () =>
      spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: "short_term",
      }),
  };

  const changeRange = async (range) => {
    const { body } = await apiCalls[range]();
    setTopTracks(body.items);
    setActiveRange(range);
  };

  const setRangeData = (range) => catchErrors(changeRange(range));

  if (!topTracks) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="max-w-6xl mx-auto px-2 md:px-6  pt-10 md:pt-24">
          <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
            <div>
              <p className="text-2xl font-semibold">Top Tracks</p>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <p
                onClick={() => setRangeData("long")}
                className={
                  "cursor-pointer " +
                  (activeRange == "long" ? classes.active : classes.inactive)
                }
              >
                All Time
              </p>
              <p
                onClick={() => setRangeData("medium")}
                className={
                  "cursor-pointer " +
                  (activeRange == "medium" ? classes.active : classes.inactive)
                }
              >
                Last 6 Months
              </p>
              <p
                onClick={() => setRangeData("short")}
                className={
                  "cursor-pointer " +
                  (activeRange == "short" ? classes.active : classes.inactive)
                }
              >
                Last 4 Weeks
              </p>
            </div>
          </div>
          <motion.div
            variants={parent}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]"
          >
            {topTracks.map((track, index) => (
              <Track key={index} track={track} />
            ))}
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
