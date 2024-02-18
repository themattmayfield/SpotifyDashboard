// import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(
      `${client_id}:${client_secret}`,
    ).toString('base64')}`,
  };
  const { refresh } = await request.json();
  const queryParamString = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh,
    client_id,
  });

  const body = await fetch(tokenUrl, {
    method: 'POST',
    headers,
    body: queryParamString.toString(),
  });

  const data = await body.json();
  //   cookies().set('test', 'test');
  //   cookies().set('access_token', data.access_token, { maxAge: data.expires_in });

  return Response.json(data);
}
