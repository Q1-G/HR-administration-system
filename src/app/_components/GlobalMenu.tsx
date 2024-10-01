"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { signOut } from 'next-auth/react';

const GlobalMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); 

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/login',
    });
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  if (pathname === '/login') return null;

  return (
    <div key={pathname}>
    
      <div className="flex items-center justify-start bg-blue-500 p-4">
        
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="text-white">☰</span>
        </button>
      
        <span className="text-white text-lg ml-2">HR Administration System</span>
      </div>

    
      {menuOpen && (
        <div className="bg-white p-4 shadow-md w-48 absolute left-4 mt-1 z-10">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link href="/home" className="text-black hover:text-green-500" onClick={handleLinkClick}>
                Employee List
              </Link>
            </li>
            <li>
              <Link href="/employees/create" className="text-black hover:text-green-500" onClick={handleLinkClick}>
                Create Employee
              </Link>
            </li>
            <li>
              <Link href="/departments" className="text-black hover:text-green-500" onClick={handleLinkClick}>
                Department List
              </Link>
            </li>
            <li>
              <Link href="/departments/create" className="text-black hover:text-green-500" onClick={handleLinkClick}>
                Create Department
              </Link>
            </li>
            <li>
              <button onClick={handleSignOut} className="text-black hover:text-green-500">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GlobalMenu;