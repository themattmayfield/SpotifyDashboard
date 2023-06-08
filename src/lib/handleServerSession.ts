import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import spotifyApi from '@/lib/spotify';
import { redirect } from 'next/navigation';

const handleServerSession = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (
    session?.error === 'RefreshAccessTokenError' ||
    !session?.user?.access_token
  ) {
    redirect('/login');
  }

  if (session?.user?.access_token) {
    spotifyApi.setAccessToken(session.user.access_token);
  }
};
export default handleServerSession;
