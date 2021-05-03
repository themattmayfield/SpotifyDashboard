import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import Profile from "../components/Profile";

import { token } from "../lib/spotifyHelper";

export default function Page() {
  const [access_token, setAccessToken] = useState(false);

  useEffect(() => {
    setAccessToken(token);
  }, []);

  return <>{access_token ? <Profile /> : <Login />}</>;
}
