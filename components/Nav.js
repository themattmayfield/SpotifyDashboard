import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

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
    <header className="flex justify-end p-6 ">    
    <div onClick={logout}  className="rounded-full w-28 h-16 bg-custom-darkgray flex justify-between items-center">
                <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
              {Cookies.get('userImage') && <img className="w-16 h-16 rounded-full" src={user.images[0].url || Cookies.get('userImage')} />}
              </div>
  </header>
</>
  );
}