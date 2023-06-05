import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '@/lib/spotify';
import type { NextAuthOptions } from 'next-auth';
console.log(LOGIN_URL);
const refreshAccessToken = async (token) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log('REFRESHED TOKEN IS', refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefressAccessTokenError',
    };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: '2f2f9d028ef14b98a6dfb63b8ef9ffb6', //process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: 'd647bf71b812489a9ac5919e1f7cdc81', // process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // init signin
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accountTokenExpires: account.expires_at * 1000,
        };
      }

      // refresh token
      if (Date.now() < token.accountTokenExpires) {
        console.log('EXISTING ACCESS TOKEN IS VALUD');
        return token;
      }

      // Access token has expired, so we need to refresh it...
      console.log('ACCESS TOKEN HAS EXPIRES, REFRESHING...');
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
};

export default NextAuth(authOptions);
