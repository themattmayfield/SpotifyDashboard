import React, { useState, useEffect } from "react";

import Layout from '../components/Layout'
import MainNavigation from './Nav'
import Loading from "./Loading";

import { getUserInfo } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [followedArtists, setFollowedArtists] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        user,
        followedArtists,
        playlists,
        topArtists,
        topTracks,
      } = await getUserInfo();
      setUser(user);
      setFollowedArtists(followedArtists);
      setPlaylists(playlists);
      setTopArtists(topArtists);
      setTopTracks(topTracks);
    };

    catchErrors(fetchData());
    console.log(followedArtists);
  }, []);

  return (
    <>
    <Layout>
    <MainNavigation />
      {user ? 
        <>
<p>{JSON.stringify(user)}</p>
<p>{JSON.stringify(followedArtists)}</p>
<p>{JSON.stringify(playlists)}</p>
<p>{JSON.stringify(topArtists)}</p>
<p>{JSON.stringify(topTracks)}</p>
        </>
       : 
        <p>
          <Loading />
        </p>
      }
    </Layout>
    </>
  );
}
