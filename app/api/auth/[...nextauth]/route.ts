// src/app/api/auth/[...nextauth]/route.ts (or pages/api/auth/[...nextauth].js)
import NextAuth, { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import jwt from 'jsonwebtoken'; // You might need a specific JWT library

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        // Decode the Keycloak access token to extract roles
        const decodedToken = jwt.decode(account.access_token);
        if (decodedToken && typeof decodedToken !== 'string') {
          // Add roles to the NextAuth token object
          token.roles =
            decodedToken.resource_access?.[
              process.env.KEYCLOAK_CLIENT_ID!
            ]?.roles || [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add roles to the session object that's accessible on the client/server
      if (session.user) {
        (session.user as any).roles = token.roles;
        (session.user as any).sub = token.sub;
      }
      return session;
      console.log(token);
    },
  },
  events: {
    async signOut({ token }) {
      // 'token' should contain the idToken to use here
      const keycloakLogoutUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?id_token_hint=${token.idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL)}`;

      await fetch(keycloakLogoutUrl, { method: 'GET' });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
