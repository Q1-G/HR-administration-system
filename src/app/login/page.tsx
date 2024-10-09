"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;

    // Validate input
    if (!username || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Use NextAuth to sign in with credentials
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setErrorMessage('Invalid username or password.');
    } else {
      // Successful login, redirect to the home page
      router.push('/home'); // Update to your home page route
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-4">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">
        Welcome to the HR Administration System
      </h1>
      <p className="text-lg text-white mb-8 text-center">
        Please login with your username and password
      </p>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Display error message */}
      <form onSubmit={handleLogin} className="space-y-6 max-w-sm w-full">
        <input
          name="username"
          type="text"
          required
          placeholder="Username"
          className="bg-white text-black p-2 rounded w-full"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="bg-white text-black p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

