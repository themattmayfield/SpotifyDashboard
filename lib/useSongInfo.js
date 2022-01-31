import { useRecoilState } from "recoil";
import { currentTrackIdState } from "atoms/songAtom";
import useSpotify from "lib/useSpotify";
import { useEffect, useState } from "react";

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    (async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongInfo(trackInfo);
      }
    })();
  }, [currentIdTrack, spotifyApi]);

  return songInfo;
};

export default useSongInfo;
