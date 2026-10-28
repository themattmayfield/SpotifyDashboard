import { describe, expect, test } from 'bun:test';

import { createTrackPlaybackBody, selectPlaybackDeviceId } from './playback';

describe('selectPlaybackDeviceId', () => {
  test('prefers the active playable device', () => {
    expect(
      selectPlaybackDeviceId([
        { id: 'available' },
        { id: 'active', is_active: true },
      ])
    ).toBe('active');
  });

  test('uses an available device when none is active', () => {
    expect(selectPlaybackDeviceId([{ id: 'desktop' }])).toBe('desktop');
  });

  test('ignores restricted devices and devices without ids', () => {
    expect(
      selectPlaybackDeviceId([
        { id: 'restricted', is_active: true, is_restricted: true },
        { is_active: true },
      ])
    ).toBeNull();
  });
});

describe('createTrackPlaybackBody', () => {
  test('plays a track through its album context', () => {
    expect(
      createTrackPlaybackBody(
        'track-id',
        'spotify:album:album-id',
        'spotify:track:track-id'
      )
    ).toEqual({
      context_uri: 'spotify:album:album-id',
      offset: { uri: 'spotify:track:track-id' },
      position_ms: 0,
    });
  });

  test('falls back to a bare track URI without an album', () => {
    expect(createTrackPlaybackBody('track-id')).toEqual({
      uris: ['spotify:track:track-id'],
      position_ms: 0,
    });
  });
});
