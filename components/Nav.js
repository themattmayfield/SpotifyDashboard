import React, { useState, useEffect } from "react";

import { getUserInfo, logout } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";

import {AiFillCaretDown} from 'react-icons/ai'

export default function MainNavigation() {
  const [user, setUser] = useState(null);

  useEffect(() => {
   
      const fetchData = async () => {
        const { user } = await getUserInfo();
        setUser(user);
      };
      catchErrors(fetchData());
    
  }, []);

  return (
    <>
    <header className="sticky-nav flex justify-between p-6 ">
    <h1 className="text-black">spotify</h1>
    
    <div className="rounded-full w-28 h-16 bg-custom-darkgray flex justify-between items-center">
                <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
              {user && <img onClick={logout} className="w-16 h-16 rounded-full" src={user.images[0].url} /> }
              </div>
  </header>
</>
  );
}