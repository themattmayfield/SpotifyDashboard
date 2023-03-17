import { useState, useEffect, useCallback } from 'react';
// import { useRecoilState } from 'recoil';
import { isPlayingState, currentTrackIdState } from '@/atoms/songAtom';
import useSongInfo from 'lib/useSongInfo';
import useSpotify from 'lib/useSpotify';
import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';
import { catchErrors } from '@/utils';

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [currentTrackId, setCurrentTrackId] = useState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useState(isPlayingState);

  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      (async () => {
        const { body: currentTrack } =
          await spotifyApi.getMyCurrentPlayingTrack();
        console.log(currentTrack);
        setCurrentTrackId(currentTrack?.item?.id);

        const { body: playbackState } =
          await spotifyApi.getMyCurrentPlaybackState();
        console.log(playbackState);
        setIsPlaying(playbackState?.is_playing);
      })();
    }
  };

  const handlePlayPause = async () => {
    const { body } = await spotifyApi.getMyCurrentPlaybackState();
    body.is_playing
      ? spotifyApi.pause() && setIsPlaying(false)
      : spotifyApi.play() && setIsPlaying(true);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      catchErrors(spotifyApi.setVolume(volume));
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* LEFT */}
      <div className="flex items-center space-x-4 ">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artist?.[0]?.name}</p>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex items-center justify-evenly">
        {isPlaying ? (
          <p onClick={handlePlayPause} className="">
            pause
          </p>
        ) : (
          <p onClick={handlePlayPause}>play</p>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-endxxx">
        <p onClick={() => volume > 0 && setVolume(volume - 10)}>down</p>
        <input
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-14 md:w-28 "
          type="range"
          value={volume}
          min={0}
          max={100}
        />
        <p onClick={() => volume < 100 && setVolume(volume + 10)}>up</p>
      </div>
    </div>
  );
};
export default Player;
