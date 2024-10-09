import { withAuth } from 'next-auth/middleware';


export default withAuth({
  callbacks: {
    
    authorized: async ({ token }) => {
    
      return !!token;
    },
  },
  pages: {
    signIn: '/login',  
  },
});

export const config = {
  matcher: [
    '/home', 
    '/employees/:path*',  
    '/departments/:path*',  
  ],
};
