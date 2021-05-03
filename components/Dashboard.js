import MainNavigation from "./mainNavigation";
import Playlists from "./Playlists";

export default function Dashboard(props) {
  return (
    <div className="h-screen">
      <MainNavigation
        loginUrl={props.loginUrl}
        displayName={props.user.display_name}
      />
      <main className="flex h-full">
        <div className="bg-grey-darkest p-6 h-max">
          {props.playlists && (
            <Playlists
              access_token={props.access_token}
              playlists={props.playlists}
            />
          )}
        </div>
        <div />
      </main>
    </div>
  );
}
