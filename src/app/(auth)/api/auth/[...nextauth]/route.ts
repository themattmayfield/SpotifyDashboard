import spotifyApi, { LOGIN_URL } from '@/lib/spotify';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
import SpotifyProvider from 'next-auth/providers/spotify';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // spotifyApi.setAccessToken(token.access_token);
    spotifyApi.setRefreshToken(token.refreshToken!);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    // console.log('REFRESHED TOKEN IS', refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
    };
  } catch (error) {
    // console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // console.logrefreshToken('Token is: ', token);
      // console.log('Account is: ', account);
      // console.log('User is: ', user);
      // init signin
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at * 1000,
          user,
        };
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        // console.log('EXISTING ACCESS TOKEN IS VALUD');
        return token;
      }

      // Access token has expired, so we need to refresh it...
      // console.log('ACCESS TOKEN HAS EXPIRES, REFRESHING...');
      const newToken = await refreshAccessToken(token);
      return newToken;
      // try {
      //   console.log('Here in refresh! Token: ', token);
      //   // console.log('Here in refresh!');

      //   spotifyApi.setAccessToken(token.access_token);
      //   spotifyApi.setRefreshToken(token.refresh_token || token.refreshToken);

      //   const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
      //   console.log('REFRESHED TOKEN IS', refreshedToken);

      //   return {
      //     ...token,
      //     access_token: refreshedToken.access_token,
      //     expires_at: Date.now() + refreshedToken.expires_in * 1000,
      //     refresh_token: refreshedToken?.refresh_token ?? token?.refresh_token,
      //   };
      // } catch (error) {
      //   console.log(error);

      //   return {
      //     ...token,
      //     error: 'RefreshAccessTokenError',
      //   };
      // }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
