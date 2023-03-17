import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chart from '@/components/Chart';
import Track from '@/components/Track';
import PlaylistComponent from '@/components/Playlist';
import Layout from '../../components/Layout';
import { catchErrors } from '@/utils/index';
import useSpotify from 'lib/useSpotify';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });

const Playlist = () => {
  const router = useRouter();
  const { query } = router;
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [playlist, setPlaylist] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);

  useEffect(() => {
    if (query.id && spotifyApi.getAccessToken()) {
      (async () => {
        const { body: playlist } = await spotifyApi.getPlaylist(query.id);
        const { body: audioFeatures } =
          await spotifyApi.getAudioFeaturesForTracks(playlist.tracks.items);
        console.log(playlist);
        setPlaylist(playlist);
        setAudioFeatures(audioFeatures);
      })();
    }
  }, [session, spotifyApi, query]);

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
              <Chart
                features={audioFeatures.audio_features}
                type="horizontalBar"
              />
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
