import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useRef } from 'react';
import { setAuth } from '@/redux/services/auth/authSlice';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

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
          router.push(`/feed`);
        })
        .catch((error : any) => {
          router.push(`/`);
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
