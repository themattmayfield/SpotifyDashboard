import React, { useEffect } from "react";
import { useRouter } from "next/router";

import SideNav from "./SideNav";

import { token, FRONTEND_URI } from "../lib/spotifyHelper";

export default function Layout({ children, profile }) {
  const router = useRouter();

    // FIX FOR VH ON MOBILE
    const changeVhVariable = () => {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      const vh = typeof window !== 'undefined' && window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      typeof document !== 'undefined' &&
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  

  useEffect(() => {
    if (!token) {
      !token && router.push(FRONTEND_URI);
    } 
    changeVhVariable();
  }, []);

  return (
    <>
      <div className="h-full flex">
        <SideNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* <Nav /> */}
          <main className={"h-full no-scrollbar " + (!profile ? 'overflow-scroll ' : '')}>{children}</main>
        </div>
      </div>
    </>
  );
}
