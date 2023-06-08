import NextAuth, { DefaultSession } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    error?: 'RefreshAccessTokenError';
    user: {
      /** The user's postal address. */
      access_token: string;
      refresh_token: string;
      username: string;
    } & DefaultSession['user'];
  }

  interface Account {
    expires_at: number;
  }
}

// nextauth.d.ts
declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    refresh_token: string;
    username: string;
    accountTokenExpires: number;
  }
}
