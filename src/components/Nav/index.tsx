import spotifyApi from '@/lib/spotify';
import NavClient from './NavClient';
import handleServerSession from '@/lib/handleServerSession';
const Nav = async () => {
  await handleServerSession();
  const { body: user } = await spotifyApi.getMe();

  return (
    <header className="flex justify-end px-2 py-4 lg:p-6">
      <NavClient user={user} />
    </header>
  );
};
export default Nav;
