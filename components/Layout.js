import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Nav from "./Nav";
import SideNav from "./SideNav";
import TrackSearchResult from "./TrackSearchResult";
import SpotifyWebApi from "spotify-web-api-node";

import { token, FRONTEND_URI, CLIENT_ID, getUserInfo } from "../lib/spotifyHelper";
import Player from "./Player";
import { catchErrors } from "../utils";

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
});

export default function Layout({ children, profile }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [popIsOpen, setPopIsOpen] = useState(false)
  const [user, setUser] = useState(null);
  

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  // FIX FOR VH ON MOBILE
  const changeVhVariable = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = typeof window !== "undefined" && window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    typeof document !== "undefined" &&
      document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    if (!token) {
      !token && router.push(FRONTEND_URI);
    }
    changeVhVariable();
  }, []);

  useEffect(() => {
    spotifyApi.setAccessToken(token);
  }, [token]);

  useEffect(() => {
    if (!search) return setSearchResults([]);

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      const { user } = await getUserInfo();
      setUser(user);
      window.localStorage.setItem('spotify_user', JSON.stringify(user));
    };
    catchErrors(fetchData());
  }, [user,token]);

  return (
    <>
      <div className="flex">        
        <SideNav track={playingTrack} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Nav popIsOpen={popIsOpen} setPopIsOpen={setPopIsOpen} search={search} setSearch={setSearch} />
          {search && (
            <div className="z-30 h-full absolute bg-black overflow-scroll w-full mt-[72px] md:mt-28">
              {searchResults.map((track) => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseTrack={chooseTrack}
                />
              ))}
              {/* {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )} */}
            </div>
          )}
          <main
            className={
              "h-full no-scrollbar " + (!profile ? "overflow-scroll " : "")
            }
          >
            {children}
            <div className="hidden md:block top-auto fixed bottom-0 z-20 w-full">
            <Player trackUri={playingTrack?.uri} />
            </div>
          </main>

          
        </div>
      </div>
    </>
  );
}
