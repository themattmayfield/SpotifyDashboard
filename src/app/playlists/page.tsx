'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Playlist from '@/components/Playlist';
import { catchErrors } from '@/utils';
import useSpotify from '@/lib/useSpotify';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import usePlaylistsQuery from '@/hooks/usePlaylistsQuery';
const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

let parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Playlists() {
  const { data: playlists } = usePlaylistsQuery();

  if (!playlists) {
    return <Loading />;
  }

  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-24">
      <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
        <div>
          <p className="text-2xl font-semibold">Your Playlists</p>
        </div>
      </div>

      <motion.div
        variants={parent}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 no-scrollbar mb-[100px]"
      >
        {playlists.map((playlist, index) => (
          <Playlist key={index} playlist={playlist} />
        ))}
      </motion.div>
    </div>
  );
}
