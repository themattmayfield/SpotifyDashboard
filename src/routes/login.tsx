import { login } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/login')({ component: Login });
function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-spotify-dark">
      <h1 className="text-4xl text-white mb-6">Spotify Profile</h1>
      <form action={login.url} method="post">
        <button
          type="submit"
          className="tracking-widest focus:outline-none no-underline transition duration-300 ease-in-out hover:bg-[#1ed760] bg-spotify-green text-white py-3.5 px-8 uppercase rounded-full"
        >
          LOG IN TO SPOTIFY
        </button>
      </form>
    </div>
  );
}
