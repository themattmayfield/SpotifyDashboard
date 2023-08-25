import handleServerSession from '@/lib/handleServerSession';
import NavClient from './NavClient';

const Nav = async () => {
  const { spotifyApi } = await handleServerSession();
  const { body: user } = await spotifyApi.getMe();

  return (
    <header className="flex justify-end px-2 py-4 lg:p-6">
      <NavClient user={user} />
    </header>
  );
};

export default Nav;
