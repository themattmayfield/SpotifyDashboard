import SpotifyProviderButton from '@/components/SpotifyProviderButton';


const Login = async () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-spotify-dark">
      <h1 className="text-4xl text-white mb-6">Spotify Profile</h1>
      <SpotifyProviderButton />
    </div>
  );
};

export default Login;
