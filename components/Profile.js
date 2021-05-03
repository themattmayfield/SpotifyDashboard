import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";
import Loading from "./Loading";
import Card from "./Card";
import RightSideBar from "./RightSideBar";

import { getUserInfo } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [followedArtists, setFollowedArtists] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const {
        user,
        followedArtists,
        playlists,
        topArtists,
        topTracks,
        recentlyPlayed,
      } = await getUserInfo();
      setUser(user);
      setFollowedArtists(followedArtists);
      setPlaylists(playlists);
      setTopArtists(topArtists);
      setTopTracks(topTracks);
      setRecentlyPlayed(recentlyPlayed);
    };

    catchErrors(fetchData());
    console.log(recentlyPlayed);
  }, []);

  return (
    <>
      <Layout>
        {topArtists ? (
          <>
            <div className="flex">
              <div className="flex flex-1 overflow-x-scroll">
                <div className="flex flex-nowrap space-x-6 ">
                  {topArtists.items.map(
                    (item, index) => index < 4 && <Card info={item} />
                  )}
                </div>
              </div>

              {recentlyPlayed ? (
                <RightSideBar recentlyPlayed={recentlyPlayed} />
              ) : (
                <p>
                  <Loading />
                </p>
              )}
            </div>
          </>
        ) : (
          <p>
            <Loading />
          </p>
        )}
      </Layout>
    </>
  );
}
