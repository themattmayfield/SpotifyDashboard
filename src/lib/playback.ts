export type SpotifyDevice = {
  id?: string | null;
  is_active?: boolean;
  is_restricted?: boolean;
};

/** Prefer the active device, then any available device that accepts commands. */
export function selectPlaybackDeviceId(devices: SpotifyDevice[]) {
  const playable = devices.filter(
    (device): device is SpotifyDevice & { id: string } =>
      !!device.id && !device.is_restricted
  );
  return (
    playable.find((device) => device.is_active)?.id ?? playable[0]?.id ?? null
  );
}

/**
 * Spotify's macOS client currently drops bare `uris` playback commands. Playing
 * through the track's album context is equivalent and is handled correctly.
 */
export function createTrackPlaybackBody(
  trackId: string,
  albumUri?: string,
  trackUri = `spotify:track:${trackId}`
) {
  return albumUri
    ? {
        context_uri: albumUri,
        offset: { uri: trackUri },
        position_ms: 0,
      }
    : { uris: [trackUri], position_ms: 0 };
}
