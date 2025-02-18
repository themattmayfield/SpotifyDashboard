import { login } from '@/lib/auth';
import { redirect } from 'next/navigation';

const Login = async () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-spotify-dark">
      <h1 className="text-4xl text-white mb-6">Spotify Profile</h1>
      <form
        action={async () => {
          'use server';
          await login();
          redirect('/');
        }}
      >
        <button
          type="submit"
          className="tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full"
        >
          LOG IN TO SPOTIFY
        </button>
      </form>
    </div>
  );
};

export default Login;
