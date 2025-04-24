import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import sql from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      if (session.user) {
        session.user.id = token.sub as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async signIn({ user, account, profile, credentials }) {
      if (!user.email) {
        return false;
      }

      try {
        // Check if user exists
        const result =
          await sql`SELECT id FROM users WHERE email = ${user.email}`;

        if (result.length === 0) {
          // Generate a new UUID for the user
          const userId = uuidv4();

          // Create new user
          await sql`
            INSERT INTO users (id, name, email, image) 
            VALUES (${userId}, ${user.name}, ${user.email}, ${user.image})
          `;

          // Create subscription with default plan
          await sql`
            INSERT INTO subscriptions (user_id, plan, status) 
            VALUES (${userId}, 'starter', 'active')
          `;
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
