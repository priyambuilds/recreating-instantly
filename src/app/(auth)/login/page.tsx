'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/forms/LoginForm';
import { login } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (username: string, password: string) => {
    try {
      await login({ username, password });
      router.push('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}