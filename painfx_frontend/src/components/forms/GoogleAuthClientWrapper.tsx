'use client';

import dynamic from 'next/dynamic';

const GoogleAuthClient = dynamic(() => import('@/components/forms/google-auth-client'), {
  ssr: false,
});

const GoogleAuthClientWrapper = () => {
  return <GoogleAuthClient />;
};

export default GoogleAuthClientWrapper;
