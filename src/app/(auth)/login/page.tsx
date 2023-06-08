import SpotifyProviderButton from '@/components/SpotifyProviderButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/route';
import spotifyApi from '@/lib/spotify';
import { redirect } from 'next/navigation';

const Login = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user?.accessToken) {
    await spotifyApi.setAccessToken(session.user.accessToken);
    redirect('/login');
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-spotify-dark">
      <h1 className="text-4xl text-white mb-6">Spotify Profile</h1>
      <SpotifyProviderButton />
    </div>
  );
};

export default Login;
