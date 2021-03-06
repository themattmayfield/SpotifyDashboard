import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Chart from "components/Chart";
import Layout from "components/Layout";
import useSpotify from "lib/useSpotify";
import { useSession } from "next-auth/react";
import { getYear } from "lib/formatters";
import dynamic from "next/dynamic";

const Loading = dynamic(() => import("components/Loading"), { ssr: false });

const Track = () => {
  const router = useRouter();
  const { query } = router;
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [track, setTrack] = useState(null);

  const [audioFeatures, setAudioFeatures] = useState(null);

  useEffect(() => {
    if (query.id && spotifyApi.getAccessToken()) {
      (async () => {
        const { body: track } = await spotifyApi.getTrack(query.id);
        const { body: features } = await spotifyApi.getAudioFeaturesForTrack(
          query.id
        );

        setTrack(track);
        setAudioFeatures(features);
      })();
    }
  }, [session, spotifyApi, query]);

  if (!track || !audioFeatures) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="no-scrollbar overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center">
        <div className="flex flex-col items-center md:flex-row text-[#565656] md:space-x-8">
          <img
            className="w-48 h-48 md:w-72 md:h-72"
            src={track.album.images[0].url}
            alt="Album Artwork"
          />
          <div className="flex flex-col space-y-1 md:space-y-3 text-center md:text-left">
            <p className="text-white text-3xl md:text-5xl mt-3 md:mt-0">
              {track.name}
            </p>
            <div className="md:text-2xl">
              {track.artists &&
                track.artists.map(({ name }, i) => (
                  <span key={i}>
                    {name}
                    {track.artists.length > 0 && i === track.artists.length - 1
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
    </Layout>
  );
};

export default Track;
