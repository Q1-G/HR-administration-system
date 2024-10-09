import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client'; 
import bcrypt from 'bcryptjs'; 
import { NextAuthOptions } from 'next-auth';
import { Role } from 'src/types/roles'; 

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;

        
        const user = await prisma.user.findUnique({
          where: { email: username }, 
        });

        if (!user) {
          return null; 
        }

        
        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!isValidPassword) {
          return null; 
        }

        
        

        
        return 1;
      },
    }),
  ],
  pages: {
    signIn: '/login',  
  },
};
 
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


