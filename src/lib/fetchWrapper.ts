import { spotifyBaseUrl } from '@/constants';
import { cookies } from 'next/headers';

const WEB_URL = process.env.WEB_URL;

let originalRequest = async (url: string, config: any) => {
  url = `${spotifyBaseUrl}${url}`;
  let response = await fetch(url, config);
  if (response.status === 204) {
    return { response };
  }
  let data = await response.json();
  return { response, data };
};

let refreshToken = async (refreshToken: string) => {
  let response = await fetch(`${WEB_URL}/api/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  let data = await response.json();

  return data;
};

let fetchWrapper = async (url: string, config: RequestInit = {}) => {
  let accessToken = cookies().get('access_token')?.value || null;
  const refresh = cookies().get('refresh_token')?.value || null;

  config['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  //   console.log('Before Request');
  let { response, data } = await originalRequest(url, config);
  //   console.log('After Request');

  if (response.status === 401) {
    const authTokens = await refreshToken(refresh!);

    accessToken = authTokens.access_token;
    config['headers'] = {
      Authorization: `Bearer ${accessToken}`,
    };

    let newResponse = await originalRequest(url, config);
    response = newResponse.response;

    data = newResponse.data;
  }

  return { response, data };
};
export default fetchWrapper;
