import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Nav from "./Nav";
import SideNav from "./SideNav";
import Head from "next/head";
// import TrackSearchResult from "./TrackSearchResult";
// import Player from "./Player";

export default function Layout({ children, profile }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

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
    changeVhVariable();
  }, []);

  // useEffect(() => {
  //   if (!search) return setSearchResults([]);

  //   let cancel = false;
  //   spotifyApi.searchTracks(search).then((res) => {
  //     if (cancel) return;
  //     setSearchResults(
  //       res.body.tracks.items.map((track) => {
  //         const smallestAlbumImage = track.album.images.reduce(
  //           (smallest, image) => {
  //             if (image.height < smallest.height) return image;
  //             return smallest;
  //           },
  //           track.album.images[0]
  //         );

  //         return {
  //           artist: track.artists[0].name,
  //           title: track.name,
  //           uri: track.uri,
  //           albumUrl: smallestAlbumImage.url,
  //         };
  //       })
  //     );
  //   });

  //   return () => (cancel = true);
  // }, [search]);

  return (
    <>
      <Head>
        <title>Spotify | Wrapper</title>
        <meta name="description" content="Spotify Wrapper" />
        <link rel="icon" href="/spotify.ico" />
      </Head>
      <div className="flex">
        <SideNav track={playingTrack} />
        <div className="flex flex-1 flex-col overflow-hidden">
          {profile && <Nav search={search} setSearch={setSearch} />}
          {/* {search && (
            <div className="z-30 h-full absolute bg-black overflow-scroll w-full mt-[72px] md:mt-28">
              {searchResults.map((track) => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseTrack={chooseTrack}
                />
              ))}
              {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
            </div>
          )} */}
          <main
            className={
              "h-full no-scrollbar " + (!profile ? "overflow-scroll " : "")
            }
          >
            {children}
            {/* <div className="hidden md:block top-auto fixed bottom-0 z-20 w-full">
              <Player />
            </div> */}
          </main>
        </div>
      </div>
    </>
  );
}
