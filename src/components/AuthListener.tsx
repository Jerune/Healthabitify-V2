'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      // Check if the message is an authentication success
      if (event.data && event.data.type === 'AUTH_SUCCESS') {
        // Navigate to the thank you page
        router.push('/wearable-auth-success');
      }
    };

    // Listen for messages from OAuth callback tabs
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  // This component doesn't render anything visible
  return null;
}
