import React, { useState, useEffect } from "react";
import Pop from './Popover'

import { getUserInfo, logout } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";


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
   
    <header className="flex justify-end md:justify-between px-2 py-4 md:p-6">
      <input
      placeholder="Search..." 
      type="search"
        
        value={props.search}
        onChange={e => props.setSearch(e.target.value)}
      className="hidden md:block rounded-full focus:outline-none border border-[#383838] bg-custom-darkgray text-white px-4 md:px-12 py-2 text-lg md:text-3xl w-8/12 h-10 md:h-16" />    
  
      <Pop popIsOpen={props.popIsOpen} setPopIsOpen={props.setPopIsOpen} user={user} />
  </header>
</>
  );
}