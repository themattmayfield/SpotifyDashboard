import { spotifyBaseUrl } from '@/constants';
import { cookies } from 'next/headers';

const WEB_URL = process.env.WEB_URL;

const originalRequest = async (url: string, config: any) => {
  const urlWithBase = `${spotifyBaseUrl}${url}`;
  const response = await fetch(urlWithBase, config);
  if (response.status === 204) {
    return { response };
  }
  const data = await response.json();
  return { response, data };
};

const refreshToken = async (refreshToken: string) => {
  const response = await fetch(`${WEB_URL}/api/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  const data = await response.json();

  return data;
};

const fetchWrapper = async (url: string, config: RequestInit = {}) => {
  let accessToken = cookies().get('access_token')?.value || null;
  const refresh = cookies().get('refresh_token')?.value || null;

  if (!accessToken || !refresh) {
    return { response: { status: 401 }, data: { error: 'Unauthorized' } };
  }

  config.headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  //   console.log('Before Request');
  let { response, data } = await originalRequest(url, config);
  //   console.log('After Request');

  if (response.status === 401) {
    const authTokens = await refreshToken(refresh);

    accessToken = authTokens.access_token;
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const newResponse = await originalRequest(url, config);
    response = newResponse.response;

    data = newResponse.data;
  }

  return { response, data };
};
export default fetchWrapper;
