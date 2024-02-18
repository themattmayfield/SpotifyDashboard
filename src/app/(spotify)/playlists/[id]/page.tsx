import React from 'react';

// import Chart from '@/components/Chart';
import PlaylistComponent from '@/components/Playlist';
import Track from '@/components/Track';
import { spotifyApi } from '@/lib/spotify';

// import dynamic from 'next/dynamic';

const Playlist = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { getPlaylist } = spotifyApi();
  const playlist = await getPlaylist(id);

  // might need to check if playlists exists??
  // const { body: audioFeatures } = await spotifyApi.getAudioFeaturesForTracks(
  //   playlist?.tracks.items
  // );

  return (
    <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-12">
      <div className="flex flex-col md:flex-row md:justify-center items-center md:items-start space-y-8 md:space-y-0 mb-[150px] md:space-x-16">
        <div className="flex flex-col items-center">
          <PlaylistComponent analytic playlist={playlist} />
          {/* {audioFeatures && (
            <Chart features={audioFeatures} type="horizontalBar" />
          )} */}
        </div>
        <div className="flex flex-col gap-4 no-scrollbar text-white w-full">
          {playlist.tracks.items.map(({ track }, index) => (
            <Track key={index} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
