import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie"
import Cookies from 'js-cookie';

import Nav from "./Nav";
import SideNav from "./SideNav";

import { getUserInfo } from "../lib/spotifyHelper";
import { catchErrors } from "../utils";

import { token, FRONTEND_URI } from "../lib/spotifyHelper";

export default function Layout({ children }) {
  const router = useRouter();
  const [cookie, setCookie] = useCookies(["userImage"])

  useEffect(() => {
    if (!token) {
      !token && router.push(FRONTEND_URI);
    } else if(!Cookies.get('userImage')) {
      const fetchData = async () => {
        const {
          user
        } = await getUserInfo();
        console.log(user.images[0].url)
        setCookie("userImage", user.images[0].url, {
          path: "/",
          maxAge: 3600, // Expires after 1hr
          sameSite: true,
        })
      };  
      catchErrors(fetchData());
      
    }
  }, []);

  return (
    <>
      <div className="h-full flex justify-between">
        <SideNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Nav />
          <main className="h-full pb-[100px] md:pb-0 overflow-y-scroll no-scrollbar">{children}</main>
        </div>
      </div>
    </>
  );
}
