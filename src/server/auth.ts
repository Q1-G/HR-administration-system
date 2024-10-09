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


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "admin" | "manager" | "employee";
      
    } & DefaultSession["user"];
  }
}


export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development', 

  callbacks: {
    
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      
      },
    }),

    
    signIn: async ({ user, account, profile }) => {
      if (user) {
        return true; 
      } else {
        console.error("Sign-in failed: User object not found.");
        return false; 
      }
    },
  },

  adapter: PrismaAdapter(db) as Adapter,

  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    
  ],
};


export const getServerAuthSession = () => getServerSession(authOptions);
