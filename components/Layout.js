import React, { useEffect } from "react";
import { useRouter } from "next/router";

import SideNav from "./SideNav";

import { token, FRONTEND_URI } from "../lib/spotifyHelper";

export default function Layout({ children, profile }) {
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
          {/* <Nav /> */}
          <main className={"h-full pb-[100px] no-scrollbar " + (!profile ? 'overflow-scroll pt-12 md:pt-24' : '')}>{children}</main>
        </div>
      </div>
    </>
  );
}
