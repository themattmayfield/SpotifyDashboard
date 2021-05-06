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
   
    <header className="flex justify-between px-2 py-4 md:p-6">
      <input
      placeholder="Search..." 
      type="search"
        
        value={props.search}
        onChange={e => props.setSearch(e.target.value)}
      className="rounded-full focus:outline-none border border-[#383838] bg-custom-darkgray text-white px-4 md:px-12 py-2 text-lg md:text-3xl w-8/12 h-10 md:h-16" />    
    <div className="rounded-full h-10 md:h-16 bg-custom-darkgray flex justify-between items-center space-x-2 md:space-x-3">
                <AiFillCaretDown className="h-4 w-4 ml-4 text-[#686868]" />
              {user && <img onClick={logout} className="h-10 w-10 md:h-16 md:w-16 rounded-full" src={user.images[0].url} /> }
              </div>
  </header>
</>
  );
}