"use client";

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      
      router.push('/home');
    } else if (status === 'unauthenticated') {
    
      router.push('/login');
    }
    
  }, [status, router]);

  if (status === 'loading') {

    return <div>Loading...</div>;
  }

  return null;
};

export default Home;