import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import { getArtist } from "../lib/spotifyHelper";
import Loading from "../components/Loading";
import { catchErrors } from "../utils/index";

export default function Artist() {
  const router = useRouter();

  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getArtist(router.query.id);
      setArtist(data);
    };
    catchErrors(fetchData());
  }, [router.query.id]);

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
