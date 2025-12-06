// src/lib/fetchWrapper.ts
import { spotifyBaseUrl } from '@/constants';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearSession,
} from './session';

const originalRequest = async (url: string, config: RequestInit) => {
  const urlWithBase = `${spotifyBaseUrl}${url}`;
  const response = await fetch(urlWithBase, config);
  if (response.status === 204) {
    return { response, data: null };
  }
  const data = await response.json();
  return { response, data };
};

const refreshToken = async (refresh: string) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID || '';
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET || '';

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
      client_id,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  return data;
};

const fetchWrapper = async (url: string, config: RequestInit = {}) => {
  let accessToken = getAccessToken();
  const refresh = getRefreshToken();

  if (!accessToken && !refresh) {
    return {
      response: { status: 401, ok: false },
      data: { error: 'Unauthorized' },
    };
  }

  // If no access token but have refresh token, try to refresh first
  if (!accessToken && refresh) {
    try {
      const tokens = await refreshToken(refresh);
      setTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || refresh,
        expiresIn: tokens.expires_in,
      });
      accessToken = tokens.access_token;
    } catch {
      clearSession();
      return {
        response: { status: 401, ok: false },
        data: { error: 'Unauthorized' },
      };
    }
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  let { response, data } = await originalRequest(url, config);

  // If unauthorized, try to refresh token and retry
  if (response.status === 401 && refresh) {
    try {
      const tokens = await refreshToken(refresh);
      setTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || refresh,
        expiresIn: tokens.expires_in,
      });

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${tokens.access_token}`,
      };

      const retryResult = await originalRequest(url, config);
      response = retryResult.response;
      data = retryResult.data;
    } catch {
      clearSession();
      return {
        response: { status: 401, ok: false },
        data: { error: 'Unauthorized' },
      };
    }
  }

  return { response, data };
};

export default fetchWrapper;
