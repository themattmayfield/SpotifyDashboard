import Cookies from 'cookies'
import querystring from 'querystring'

import { CLIENT_ID, REDIRECT_URI } from '../../lib/spotifyHelper'

var keys = ['keyboard cat']
const stateKey = 'spotify_auth_state';

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

export default (req, res) => {
    const cookies = new Cookies(req, res, { keys: keys })
    const state = generateRandomString(16);
    cookies.set(stateKey, state);

    // your application requests authorization
    const scope =
      'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public';

    res.redirect(
      `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
      })}`,
    );
  }
  