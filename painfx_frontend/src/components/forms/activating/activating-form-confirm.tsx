'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useActivationMutation } from '@/redux/services/auth/authApiSlice';
import { Spinner } from '@/components/spinner';

interface ActivitingProps {
  uid: string;
  token: string;
}

const ActivitingConfirmForm = ({ uid, token }: ActivitingProps) => {
  const router = useRouter();
  const [activation] = useActivationMutation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    activation({ uid, token })
      .unwrap()
      .then(() => {
        toast.success('Account activated successfully!');
      })
      .catch((error) => {
        const errorMessage = error?.data?.message || 'Failed to activate account';
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
        router.push('/sign-in');
      });
  }, [activation, router, uid, token]);

  return (
    <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
      <h1
        className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'
        aria-live='polite'
      >
        {isLoading ? 'Activating your account...' : 'Redirecting to sign-in...'}
      </h1>
      {isLoading && (
        <div className="flex justify-center mt-4">
          <Spinner/>
        </div>
      )}
    </div>
  );
};

export default ActivitingConfirmForm;
