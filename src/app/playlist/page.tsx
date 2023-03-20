'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Chart from '@/components/Chart';
import Track from '@/components/Track';
import PlaylistComponent from '@/components/Playlist';
import Layout from '../../components/Layout';

import dynamic from 'next/dynamic';
import usePlaylistQuery from '@/hooks/usePlaylistQuery';
import usePlaylistFeaturesQuery from '@/hooks/usePlaylistFeaturesQuery';

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

const Playlist = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') as string;

  const { data: playlist } = usePlaylistQuery(id);

  const { data: audioFeatures } = usePlaylistFeaturesQuery(
    id,
    playlist?.tracks.items,
    {
      enabled: !!playlist,
    }
  );

  if (!playlist || !audioFeatures) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-12">
        <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start space-y-8 md:space-y-0 mb-[100px] md:space-x-16">
          <div className="flex flex-col items-center">
            <PlaylistComponent analytic playlist={playlist} />
            {audioFeatures && (
              <Chart features={audioFeatures} type="horizontalBar" />
            )}
          </div>
          <div className="flex flex-col gap-4 no-scrollbar text-white w-full">
            {playlist.tracks.items.map((track, index) => (
              <Track analytic key={index} track={track} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Playlist;
