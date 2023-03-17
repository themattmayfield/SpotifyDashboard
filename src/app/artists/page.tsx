'use client';

import React, { useState } from 'react';
import useSpotify from '@/lib/useSpotify';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import { useQuery } from '@tanstack/react-query';

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
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  // const [topArtists, setTopArtists] = useState(artistsState);
  const [activeRange, setActiveRange] = useState('long');

  const getData = async (range) => {
    const { body } = await spotifyApi
      .getMyTopArtists({
        limit: 50,
        time_range: range,
      })
      .then((data) => data);

    return body;
  };
  const { data: topArtists_LONG } = useQuery({
    queryKey: ['topArtists_LONG'],
    queryFn: () => getData('long_term'),
  });
  const { data: topArtists_MEDIUM } = useQuery({
    queryKey: ['topArtists_MEDIUM'],
    queryFn: () => getData('medium_term'),
  });
  const { data: topArtists_SHORT } = useQuery({
    queryKey: ['topArtists_SHORT'],
    queryFn: () => getData('short_term'),
  });
  console.log(topArtists_LONG);

  // useEffect(() => {
  //   if (spotifyApi.getAccessToken()) {
  //     (async () => {
  //       const { body } = await getData();

  //       setTopArtists((prevState) => ({ ...prevState, long: body.items }));
  //     })();
  //   }
  // }, [session, spotifyApi]);

  const getRangeData = (range) => {
    switch (range) {
      case 'long':
        return topArtists_LONG;
      case 'medium':
        return topArtists_MEDIUM;
      case 'short':
        return topArtists_SHORT;
      default:
        return topArtists_LONG;
    }
  };

  const setRangeData = (range) => setActiveRange(range);

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
                onClick={() => setRangeData('long')}
                className={
                  'cursor-pointer ' +
                  (activeRange == 'long' ? classes.active : classes.inactive)
                }
              >
                All Time
              </p>
              <p
                onClick={() => setRangeData('medium')}
                className={
                  'cursor-pointer ' +
                  (activeRange == 'medium' ? classes.active : classes.inactive)
                }
              >
                Last 6 Months
              </p>
              <p
                onClick={() => setRangeData('short')}
                className={
                  'cursor-pointer ' +
                  (activeRange == 'short' ? classes.active : classes.inactive)
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
            {getRangeData(activeRange).items.map((item, index) => (
              <Card key={index} info={item} />
            ))}
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
