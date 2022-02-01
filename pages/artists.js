import React, { useState, useEffect } from "react";
import useSpotify from "lib/useSpotify";
import { useSession } from "next-auth/react";
import Layout from "components/Layout";
import Card from "components/Card";
import { catchErrors } from "utils";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { artistsState } from "atoms/artistsAtom";
import { useRecoilState } from "recoil";

let parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Loading = dynamic(() => import("components/Loading"), { ssr: false });

const classes = {
  active: "border-b border-white",
  inactive: "border-b border-transparent",
};

export default function Artists() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [topArtists, setTopArtists] = useRecoilState(artistsState);
  const [activeRange, setActiveRange] = useState("long");

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      (async () => {
        const { body } = await spotifyApi.getMyTopArtists({
          limit: 50,
          time_range: "long_term",
        });

        setTopArtists((prevState) => ({ ...prevState, long: body.items }));
      })();
    }
  }, [session, spotifyApi]);

  const apiCalls = {
    long: () =>
      spotifyApi.getMyTopArtists({
        limit: 50,
        time_range: "long_term",
      }),
    medium: () =>
      spotifyApi.getMyTopArtists({
        limit: 50,
        time_range: "medium_term",
      }),
    short: () =>
      spotifyApi.getMyTopArtists({
        limit: 50,
        time_range: "short_term",
      }),
  };

  const changeRange = async (range) => {
    setActiveRange(range);
    if (topArtists[range] !== null) {
      return;
    }
    const { body } = await apiCalls[range]();
    setTopArtists((prevState) => ({ ...prevState, [range]: body.items }));
  };

  const setRangeData = (range) => catchErrors(changeRange(range));

  if (!topArtists[activeRange]) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="max-w-5xl mx-auto px-2 md:px-4 no-scrollbar pt-10 md:pt-24">
          <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
            <div>
              <p className="text-2xl font-semibold">Top Artists</p>
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
            className="grid grid-cols-2 md:grid-cols-3 gap-y-2 md:gap-6 no-scrollbar mb-[100px]"
          >
            {topArtists[activeRange].map((item, index) => (
              <Card key={index} info={item} />
            ))}
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
