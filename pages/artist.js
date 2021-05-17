import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import {
  getArtist,
  doesUserFollowArtist,
  followArtist,
} from "../lib/spotifyHelper";
import Loading from "../components/Loading";
import { catchErrors } from "../utils/index";

export default function Artist() {
  const router = useRouter();

  const [artist, setArtist] = useState(null);
  const [followingArtist, setFollowingArtist] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getArtist(router.query.id);
      setArtist(data);
    };
    catchErrors(fetchData());
  }, [router.query.id]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await doesUserFollowArtist(router.query.id);
      setFollowingArtist(data[0]);
    };
    catchErrors(fetchData());
  }, [followingArtist]);

  const followHandler = () => {
    followArtist(router.query.id, followingArtist ? "delete" : "put");
    setFollowingArtist(!followingArtist);
  };
  return (
    <Layout>
      {artist ? (
        <div className="flex flex-col items-center text-center text-white pt-10 md:pt-24 space-y-4 md:space-y-8">
          <div
            className="rounded-full bg-cover bg-center w-40 h-40 md:w-80 md:h-80"
            style={{
              backgroundImage: `url(${artist.images[0].url})`,
            }}
          ></div>

          <p className="text-4xl md:text-7xl">{artist.name}</p>
          <button
            onClick={() => followHandler()}
            className={`bg-transparent border text-white rounded px-4 py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${
              followingArtist ? "border-white" : "border-gray-900"
            }`}
          >
            {followingArtist ? "Following" : `Follow`}
          </button>
          <div className="flex space-x-12 items-center justify-center">
            <div>
              <p className="text-xl md:text-3xl">{artist.followers.total}</p>
              <p className="text-sm text-[#565656]">Followers</p>
            </div>
            <div>
              <p className="text-xl md:text-3xl">{artist.popularity}</p>
              <p className="text-sm text-[#565656]">Popularity</p>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  );
}
