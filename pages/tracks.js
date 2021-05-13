import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Track from "../components/Track";

import {
  getTopTracksShort,
  getTopTracksMedium,
  getTopTracksLong,
} from "../lib/spotifyHelper";

import { catchErrors } from "../utils";

const classes = {
  active: "border-b border-white",
  inactive: "border-b border-transparent",
};

export default function Tracks() {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState("long");

  const apiCalls = {
    long: getTopTracksLong(),
    medium: getTopTracksMedium(),
    short: getTopTracksShort(),
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopTracksLong();
      setTopTracks(data);
    };
    catchErrors(fetchData());
  }, []);

  const changeRange = async (range) => {
    const { data } = await apiCalls[range];
    setTopTracks(data);
    setActiveRange(range);
  };

  const setRangeData = (range) => catchErrors(changeRange(range));

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
          {topTracks ? (
            <div className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]">
              {topTracks.items.map((track, index) => (
                <Track key={index} track={track} />
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
