import spotifyApi from '@/lib/spotify';
import NavClient from './NavClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth/[...nextauth]/route';

export default async function Default() {
  const session = await getServerSession(authOptions);
  if (
    session.error === 'RefreshAccessTokenError' ||
    !session.user.accessToken
  ) {
    console.log('going to signin');

    // signIn();
  }

  if (session?.user.accessToken) {
    await spotifyApi.setAccessToken(session.user.accessToken);
  }

  console.log('session', session);
  const { body: user } = await spotifyApi.getMe();

  return (
    <header className="flex justify-end px-2 py-4 lg:p-6">
      <NavClient user={user} />
    </header>
  );
}
