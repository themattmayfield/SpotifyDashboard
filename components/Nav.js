import React, { useState, useEffect } from "react";

import { getUserInfo, logout } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";

import {AiFillCaretDown} from 'react-icons/ai'

export default function Default(props) {
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
   
    <header className="flex justify-between p-6">
      <input
      placeholder="Search..." 
      type="search"
        
        value={props.search}
        onChange={e => props.setSearch(e.target.value)}
      className="flex-1 rounded-full focus:outline-none border border-[#383838] bg-custom-darkgray text-white px-12 py-2 text-3xl" />    
    <div className="rounded-full w-28 h-16 bg-custom-darkgray flex justify-between items-center">
                <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
              {user && <img onClick={logout} className="w-16 h-16 rounded-full" src={user.images[0].url} /> }
              </div>
  </header>
</>
  );
}