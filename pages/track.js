import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Chart from "../components/Chart";
import PlaylistComponent from "../components/Playlist";

import Layout from "../components/Layout";
import Loading from "../components/Loading";

import { getTrackInfo } from "../lib/spotifyHelper";
import {
  formatDuration,
  getYear,
  parsePitchClass,
  catchErrors,
} from "../utils/index";

const Track = () => {
  const router = useRouter();

  const [track, setTrack] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrackInfo(router.query.id);
      setTrack(data.track);
      setAudioAnalysis(data.audioAnalysis);
      setAudioFeatures(data.audioFeatures);
    };
    catchErrors(fetchData());
  }, [router.query.id]);

  return (
    <Layout>
      {track ? (
        <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center">
          <div className="flex flex-col items-center md:flex-row text-[#565656] md:space-x-8">
            <img
              className="w-48 h-48 md:w-72 md:h-72"
              src={track.album.images[0].url}
              alt="Album Artwork"
            />
            <div className="flex flex-col space-y-1 md:space-y-3 text-center md:text-left">
              <p className="text-white text-3xl md:text-6xl mt-3 md:mt-0">
                {track.name}
              </p>
              <div className="md:text-2xl">
                {track.artists &&
                  track.artists.map(({ name }, i) => (
                    <span key={i}>
                      {name}
                      {track.artists.length > 0 &&
                      i === track.artists.length - 1
                        ? ""
                        : ","}
                      &nbsp;
                    </span>
                  ))}
              </div>
              <div className="md:text-lg">
                <a
                  href={track.album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {track.album.name}
                </a>{" "}
                &middot; {getYear(track.album.release_date)}
              </div>
            </div>
          </div>
          <div className="w-full md:max-w-xl">
            {audioFeatures && <Chart features={audioFeatures} type="" />}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  );
};

export default Track;
