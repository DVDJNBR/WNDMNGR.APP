'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const accessToken = searchParams.get('access_token');
    const idToken = searchParams.get('id_token');

    if (accessToken && idToken) {
      processed.current = true;
      setAuthData(accessToken, idToken);
      router.push('/');
    } else {
      console.error('Missing tokens in callback');
      router.push('/?error=missing_tokens');
    }
  }, [searchParams, setAuthData, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-muted-foreground">Completing sign in...</p>
    </div>
  );
}
