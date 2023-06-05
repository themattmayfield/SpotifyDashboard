import { authOptions } from '@/app/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import spotifyApi from './spotify';

const handleServerSession = async () => {
  const session = await getServerSession(authOptions);
  if (
    session.error === 'RefreshAccessTokenError' ||
    !session.user.accessToken
  ) {
    // signIn();
  }

  if (session?.user.accessToken) {
    await spotifyApi.setAccessToken(session.user.accessToken);
  }
};
export default handleServerSession;
