import { getProviders } from 'next-auth/react';
import SpotifyProviderButton from './components/SpotifyProviderButton';

const Login = async () => {
  const { spotify: spotifyProvider } = await getProviders();

  return (
    <div className="flex justify-center items-center h-screen bg-spotify-dark">
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-4xl text-white mb-6">Spotify Profile</h1>

        <div>
          <SpotifyProviderButton {...spotifyProvider} />
        </div>
      </div>
    </div>
  );
};

export default Login;
