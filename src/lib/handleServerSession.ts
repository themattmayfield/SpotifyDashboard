import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import spotifyApi from '@/lib/spotify';
import { redirect } from 'next/navigation';

const handleServerSession = async () => {
  const session = await getServerSession(authOptions);
  if (
    session?.error === 'RefreshAccessTokenError' ||
    !session?.user?.accessToken
  ) {
    redirect('/login');
  }

  if (session?.user?.accessToken) {
    await spotifyApi.setAccessToken(session.user.accessToken);
  }
};
export default handleServerSession;
