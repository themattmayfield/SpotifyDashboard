import Link from "next/link";

export default function Playlists(props) {
    return (
      <>
        <h3 className="mb-1 text-white text-xs">PLAYLISTS</h3>
        <ul className="list-reset">
          {props.playlists.items.map(playlist => {
            return (
              <li className="mb-2 hover:bg-grey-darkest" key={playlist.id}>
                <Link
                  href={{
                    pathname: "/playlist",
                    query: {
                      access_token: props.access_token,
                      id: playlist.id,
                      playlist: playlist.name
                    }
                  }}
                >
                  <a className="text-grey-light text-sm no-underline hover:text-white">
                    {playlist.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </>
    );
  };