import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Chart from "../components/Chart";

import Track from "../components/Track";
import PlaylistComponent from "../components/Playlist";
import Layout from "../components/Layout";
import Loading from "../components/Loading";

import { getPlaylist, getAudioFeaturesForTracks } from "../lib/spotifyHelper";
import { catchErrors } from "../utils/index";

const Playlist = () => {
  const router = useRouter();

  const [playlist, setPlaylist] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylist(router.query.id);
      setPlaylist(data);
    };
    catchErrors(fetchData());
  }, [router.query.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (playlist) {
        const { data } = await getAudioFeaturesForTracks(playlist.tracks.items);
        setAudioFeatures(data);
        console.log(audioFeatures);
      }
    };
    catchErrors(fetchData());
  }, [playlist]);

  return (
    <Layout>
      <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-12">
        {playlist ? (
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
                <Track analytic track={track} />
              ))}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </Layout>
  );
};

export default Playlist;
