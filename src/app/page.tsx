'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import RightSideBar from '@/components/RightSideBar';
import Subtitle from '@/components/Subtitle';
import TopTracks from '@/components/TopTracks';
import TopArtists from '@/components/TopArtists';
import useSpotify from '@/lib/useSpotify';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import useRecentlyPlayedQuery from '@/hooks/useRecentlyPlayedQuery';
import useArtistsQuery from '@/hooks/useArtistsQuery';
import useTracksQuery from '@/hooks/useTracksQuery';

let parent = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

export default function Profile() {
  const { data: recentData } = useRecentlyPlayedQuery();

  const { data: tracksData } = useTracksQuery({
    time_range: 'long_term',
  });

  const { data: topArtists_LONG_Data } = useArtistsQuery({
    time_range: 'long_term',
  });
  const { data: topArtists_SHORT_data } = useArtistsQuery({
    time_range: 'short_term',
  });

  const recentlyPlayed = recentData?.slice(0, 6);
  const topTracks = tracksData?.slice(0, 6);
  const topArtists_LONG = topArtists_LONG_Data?.slice(0, 16);
  const topArtists_SHORT = topArtists_SHORT_data?.slice(0, 4);

  return (
    <Layout profile>
      {!recentlyPlayed ||
      !topTracks ||
      !topArtists_LONG ||
      !topArtists_SHORT ? (
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
                {topArtists_LONG.map((item, index) => (
                  <Card profile key={index} info={item} />
                ))}
              </div>
            </div>
            <div className="px-2 lg:pl-2 flex flex-col xl:flex-row 2xl:flex-nowrap no-scrollbar gap-y-16 gap-x-8">
              <TopTracks topTracksShort={topTracks} />
              <TopArtists topArtistsShort={topArtists_SHORT} />
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
