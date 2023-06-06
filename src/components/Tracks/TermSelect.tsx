'use client';
import React, { useState } from 'react';
import Track from '../../components/Track';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { TTimeRange } from '@/types';
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

const TermSelect = ({ long_term, short_term, medium_term }: any) => {
  const [activeRange, setActiveRange] = useState<{
    term: TTimeRange;
    data: any;
  }>({
    term: 'long_term',
    data: long_term,
  });

  const terms = [
    {
      action: () =>
        setActiveRange({
          term: 'long_term',
          data: long_term,
        }),
      range: 'long_term',
      text: 'All Time',
    },
    {
      action: () =>
        setActiveRange({
          term: 'medium_term',
          data: medium_term,
        }),
      range: 'medium_term',
      text: 'Last 6 Months',
    },
    {
      action: () =>
        setActiveRange({
          term: 'short_term',
          data: short_term,
        }),
      range: 'short_term',
      text: 'Last 4 Weeks',
    },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto px-2 md:px-6  pt-10 md:pt-24">
        <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
          <div>
            <p className="text-2xl font-semibold">Top Tracks</p>
          </div>
          <div className="flex items-center justify-center space-x-4">
            {terms.map(({ text, action, range }) => (
              <p
                onClick={action}
                className={
                  'cursor-pointer ' +
                  (activeRange.term == range
                    ? classes.active
                    : classes.inactive)
                }
              >
                {text}
              </p>
            ))}
          </div>
        </div>
        <motion.div
          variants={parent}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 no-scrollbar text-white mb-[100px]"
        >
          {activeRange.data.map(
            (
              track:
                | SpotifyApi.PlayHistoryObject
                | SpotifyApi.PlaylistTrackObject,
              index: React.Key | null | undefined
            ) => (
              <Track key={index} track={track} />
            )
          )}
        </motion.div>
      </div>
    </>
  );
};
export default TermSelect;
