import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import spotifyApi from '@/lib/spotify';
import { redirect } from 'next/navigation';

const handleServerSession = async () => {
  const session = await getServerSession(authOptions);
  if (session?.error === 'RefreshAccessTokenError' || !session?.accessToken) {
    redirect('/login');
  }

  if (session?.accessToken) {
    spotifyApi.setAccessToken(session.accessToken);
  }
  if (!session?.accessToken) {
    console.log('NO TOKEN!!!!');
    redirect('/login');
  }

  return session;
};
export default handleServerSession;
