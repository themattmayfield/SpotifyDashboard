import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import spotifyApi from '@/lib/spotify';
import { redirect } from 'next/navigation';

const handleServerSession = async () => {
  console.log('I RAN');

  const session = await getServerSession(authOptions);
  // console.log(session);
  if (session?.error === 'RefreshAccessTokenError' || !session?.accessToken) {
    redirect('/login');
  }

  if (session?.accessToken) {
    spotifyApi.setAccessToken(session.accessToken);
  }
};
export default handleServerSession;
