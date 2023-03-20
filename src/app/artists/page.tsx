'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import useArtistsQuery from '@/hooks/useArtistsQuery';
import { TTimeRange } from '@/types';

let parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

const classes = {
  active: 'border-b border-white',
  inactive: 'border-b border-transparent',
};

export default function Artists() {
  const [activeRange, setActiveRange] = useState<TTimeRange>('long_term');

  const { data: topArtists_LONG } = useArtistsQuery({
    time_range: 'long_term',
  });
  const { data: topArtists_MEDIUM } = useArtistsQuery({
    time_range: 'medium_term',
  });
  const { data: topArtists_SHORT } = useArtistsQuery({
    time_range: 'short_term',
  });

  const getRangeData = (range: TTimeRange) => {
    switch (range) {
      case 'long_term':
        return topArtists_LONG;
      case 'medium_term':
        return topArtists_MEDIUM;
      case 'short_term':
        return topArtists_SHORT;
      default:
        return topArtists_LONG;
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
        <div className="max-w-5xl mx-auto px-2 md:px-4 no-scrollbar pt-10 md:pt-24">
          <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
            <div>
              <p className="text-2xl font-semibold">Top Artists</p>
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
            className="grid grid-cols-2 md:grid-cols-3 gap-y-2 md:gap-6 no-scrollbar mb-[100px]"
          >
            {getRangeData(activeRange).map((item, index) => (
              <Card key={index} info={item} />
            ))}
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
