import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import { getArtist } from '../lib/spotifyHelper';
import Loading from '../components/Loading'
import { catchErrors } from '../utils/index'

export default function Artist(props) {
    const router = useRouter()
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
            <div className="flex flex-col items-center justify-center text-white h-full">
            {/* hello */}
            <img className="rounded-full w-80 h-80" src={artist.images[0].url} />
            
            <p className="text-7xl">{artist.name}</p>
            <p>{artist.popularity}</p>
            <p>{artist.followers.total}</p>
        </div>
        </Layout>
    )
}