import request from 'request'
import querystring from 'querystring'

import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, FRONTEND_URI } from '../../lib/spotifyHelper'

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