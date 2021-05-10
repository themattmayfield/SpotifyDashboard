import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import { getArtist } from "../lib/spotifyHelper";
import Loading from "../components/Loading";
import { catchErrors } from "../utils/index";

export default function Artist(props) {
  const router = useRouter();
  // console.log(router.query.id)

  // const artistId = router.query.id;

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
        <div className="flex flex-col items-center justify-center text-white h-full">
          <div
            className="rounded-full bg-cover bg-center w-80 h-80"
            style={{
              backgroundImage: `url(${artist.images[0].url})`,
            }}
          ></div>

          <p className="text-7xl">{artist.name}</p>
          <p>{artist.popularity}</p>
          <p>{artist.followers.total}</p>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  );
}
