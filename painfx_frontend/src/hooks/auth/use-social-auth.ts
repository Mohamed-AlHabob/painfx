import { useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { extractErrorMessage } from '../error-handling';
import { setAuth } from '@/redux/services/auth/authSlice';

export default function useSocialAuth(authenticate: unknown, provider: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (state && code && typeof authenticate === 'function') {
      authenticate({ provider, state, code })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          toast.success('Successfully logged in!');
          router.push('/X/post');
        })
        .catch((error : any) => {
          const errorMessage = extractErrorMessage(error);
          toast.error(`Authentication failed: ${errorMessage}`);
          router.push('/sign-in');
        })
        .finally(() => {
          effectRan.current = true;
        });
    }

    return () => {
      effectRan.current = false;
    };
  }, [authenticate, provider, searchParams, dispatch, router]);
  return {};
}
