import MainNavigation from "./mainNavigation";
import Playlists from "./Playlists";

export default function Dashboard({ loginUrl, user, playlists, access_token}) {
  return (
    <div className="h-screen">
      <MainNavigation
        loginUrl={loginUrl}
        displayName={user.display_name}
      />
      <main className="flex h-full">
        <div className="bg-grey-darkest p-6 h-max">
          {playlists && (
            <Playlists
              access_token={access_token}
              playlists={playlists}
            />
          )}
        </div>
        <div />
      </main>
    </div>
  );
}
