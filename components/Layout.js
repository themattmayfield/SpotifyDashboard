import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { token, FRONTEND_URI } from "../lib/spotifyHelper";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    !token && router.push(FRONTEND_URI);
  }, []);
  return <div>{children}</div>;
}
