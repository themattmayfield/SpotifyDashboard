import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Nav from "./Nav";
import SideNav from "./SideNav"

import { getUserInfo, token, FRONTEND_URI } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      !token && router.push(FRONTEND_URI);
    } else {
      const fetchData = async () => {
        const { user } = await getUserInfo();
        setUser(user);
      };
      catchErrors(fetchData());
    }
  }, []);

  return (
    <>
      <div className="h-full flex overflow-x-hidden justify-between">
          <SideNav />
      <div className="flex flex-1 flex-col overflow-hidden">
      <Nav user={user} />
      <main className="h-full pr-6">{children}</main>
      </div>
      </div>
    </>
  );
}
