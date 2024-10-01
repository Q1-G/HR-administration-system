import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "../env";
import { db } from "../server/db";

// Module augmentation for `next-auth` types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
    } & DefaultSession["user"];
  }
}

// Options for NextAuth.js
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development', 

  callbacks: {
    // Customize session callback
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),

    // Error handling for sign-in
    signIn: async ({ user, account, profile }) => {
      if (user) {
        return true; // Allow sign-in
      } else {
        console.error("Sign-in failed: User object not found.");
        return false; // Reject sign-in
      }
    },
  },

  adapter: PrismaAdapter(db) as Adapter,

  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // Add more providers if needed
  ],
};

// Wrapper for `getServerSession`
export const getServerAuthSession = () => getServerSession(authOptions);
