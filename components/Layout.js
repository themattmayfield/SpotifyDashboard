import React, { useEffect } from "react";
import { useRouter } from "next/router";

import Nav from "./Nav";
import SideNav from "./SideNav";

import { token, FRONTEND_URI } from "../lib/spotifyHelper";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      !token && router.push(FRONTEND_URI);
    }
  }, []);

  return (
    <>
      <div className="h-full flex justify-between">
        <SideNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Nav />
          <main className="h-full pb-[100px] md:pb-0 overflow-y-scroll">{children}</main>
        </div>
      </div>
    </>
  );
}
