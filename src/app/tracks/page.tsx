'use client';
import React, { useState, useEffect } from 'react';
import useSpotify from '@/lib/useSpotify';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import Track from '../../components/Track';
import { catchErrors } from '../../utils';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { tracksState } from '@/atoms/tracksAtom';
import useTracksQuery from '@/hooks/useTracksQuery';
import { TTimeRange } from '@/types';
// import { useRecoilState } from 'recoil';
const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

let parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const classes = {
  active: 'border-b border-white',
  inactive: 'border-b border-transparent',
};

export default function Tracks() {
  const [activeRange, setActiveRange] = useState<TTimeRange>('long_term');

  const { data: topTracks_LONG } = useTracksQuery({
    time_range: 'long_term',
  });
  const { data: topTracks_MEDIUM } = useTracksQuery({
    time_range: 'medium_term',
  });
  const { data: topTracks_SHORT } = useTracksQuery({
    time_range: 'short_term',
  });

  const getRangeData = (range: TTimeRange) => {
    switch (range) {
      case 'long_term':
        return topTracks_LONG;
      case 'medium_term':
        return topTracks_MEDIUM;
      case 'short_term':
        return topTracks_SHORT;
      default:
        return topTracks_LONG;
    }
  };

  const setRangeData = (range: TTimeRange) => setActiveRange(range);

  if (!getRangeData(activeRange)) {
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
                onClick={() => setRangeData('long_term')}
                className={
                  'cursor-pointer ' +
                  (activeRange == 'long_term'
                    ? classes.active
                    : classes.inactive)
                }
              >
                All Time
              </p>
              <p
                onClick={() => setRangeData('medium_term')}
                className={
                  'cursor-pointer ' +
                  (activeRange == 'medium_term'
                    ? classes.active
                    : classes.inactive)
                }
              >
                Last 6 Months
              </p>
              <p
                onClick={() => setRangeData('short_term')}
                className={
                  'cursor-pointer ' +
                  (activeRange == 'short_term'
                    ? classes.active
                    : classes.inactive)
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
            {getRangeData(activeRange).map((track, index) => (
              <Track key={index} track={track} />
            ))}
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
