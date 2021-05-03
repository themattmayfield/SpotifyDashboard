import { logout } from "../lib/spotifyHelper";

import {AiFillCaretDown} from 'react-icons/ai'

export default function MainNavigation(props) {

  return (
    <>
    {props.user ? <header className="sticky-nav flex justify-between p-6 ">
    <h1 className="text-black">spotify</h1>
    
    <div className="rounded-full w-28 h-16 bg-custom-darkgray flex justify-between items-center">
                <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
              <img onClick={logout} className="w-16 h-16 rounded-full" src={props.user.images[0].url} />
              </div>
  </header>
:
<p>Loading</p>}
</>
  );
}