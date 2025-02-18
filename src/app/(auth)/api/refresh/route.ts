import { spotifyTokenUrl } from '@/constants';
import { Resource } from 'sst';
export async function POST(request: Request) {
  const client_id = Resource.NEXT_PUBLIC_CLIENT_ID.value;
  const client_secret = Resource.NEXT_PUBLIC_CLIENT_SECRET.value;

  if (!client_id || !client_secret) {
    return Response.json(
      { error: 'Missing client ID or secret' },
      { status: 500 }
    );
  }

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(
      `${client_id}:${client_secret}`
    ).toString('base64')}`,
  };
  const { refresh } = await request.json();
  const queryParamString = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh,
    client_id,
  });

  const body = await fetch(spotifyTokenUrl, {
    method: 'POST',
    headers,
    body: queryParamString.toString(),
  });

  const data = await body.json();

  return Response.json(data);
}
