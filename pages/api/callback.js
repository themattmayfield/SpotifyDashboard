import request from 'request'
import querystring from 'querystring'

import { FRONTEND_URI } from '../../lib/spotifyHelper'

const CLIENT_ID = process.env.CLIENT_ID;
let REDIRECT_URI = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/callback/' : process.env.REDIRECT_URI
let CLIENT_SECRET = process.env.CLIENT_SECRET

export default (req, res) => {

    const code = req.query.code || null;
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
          },
          headers: {
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
              'base64',
            )}`,
          },
          json: true,
        };
  
        request.post(authOptions, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;
  
            // we can also pass the token to the browser to make requests from there
            res.redirect(
              `${FRONTEND_URI}/#${querystring.stringify({
                access_token,
                refresh_token,
              })}`,
            );
          } else {
            res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
          }
        });
      
  };