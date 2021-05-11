import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Track from "../components/Track";
import Playlistt from "../components/Playlist";
import Layout from "../components/Layout";
import { IoMusicalNotesSharp } from "react-icons/io5";

import { getPlaylist, getAudioFeaturesForTracks } from "../lib/spotifyHelper";
import Loading from "../components/Loading";
import { catchErrors } from "../utils/index";

const Playlist = () => {
  const router = useRouter();

  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylist(router.query.id);
      setPlaylist(data);
    };
    catchErrors(fetchData());
  }, [router.query.id]);
  return (
    <Layout>
      <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-4 md:pt-12">
        {playlist ? (
          <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start space-y-8 md:space-y-0 mb-[100px]">
            <Playlistt analytic playlist={playlist} />
            <div className="flex flex-col gap-4 no-scrollbar text-white max-w-3xl">
              {playlist.tracks.items.map((track, index) => (
                <Track track={track} />
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
