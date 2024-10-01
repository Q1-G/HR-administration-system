"use client";

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to home page if logged in
      router.push('/home');
    } else if (status === 'unauthenticated') {
      // Redirect to login page if not logged in
      router.push('/login');
    }
    // No redirect during loading phase
  }, [status, router]);

  if (status === 'loading') {
    // While the session is loading, render a loading screen
    return <div>Loading...</div>;
  }

  return null;
};

export default Home;