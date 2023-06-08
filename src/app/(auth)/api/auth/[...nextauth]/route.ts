import spotifyApi, { LOGIN_URL } from '@/lib/spotify';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
import SpotifyProvider from 'next-auth/providers/spotify';

const refreshAccessToken = async (token: JWT) => {
  try {
    spotifyApi.setAccessToken(token.access_token);
    spotifyApi.setRefreshToken(token.refresh_token);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log('REFRESHED TOKEN IS', refreshedToken);

    return {
      ...token,
      access_token: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refresh_token: refreshedToken.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefressAccessTokenError',
    };
  }
};

export const authOptions: AuthOptions = {
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
          access_token: account.access_token,
          refresh_token: account.refresh_token,
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
      session.user.access_token = token.access_token;
      session.user.refresh_token = token.refresh_token;
      session.user.username = token.username;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
