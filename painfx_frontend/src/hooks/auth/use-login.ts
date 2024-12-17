import { useAppDispatch } from '@/redux/hooks';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { extractErrorMessage } from '../error-handling';
import { setAuth } from '@/redux/services/auth/authSlice';
import { useLoginMutation } from '@/redux/services/auth/authApiSlice';
import { SignInSchema } from '@/schemas/auth';

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: 'onBlur',
  });

  const onAuthenticateUser = handleSubmit(async (values) => {
    toast.promise(
      login({ email: values.email, password: values.password }).unwrap(),
      {
        loading: "Logging in...",
        success: () => {
          dispatch(setAuth());
          router.push('/X');
          return "Logged in successfully!";
        },
        error: (error) => {
          const errorMessage = extractErrorMessage(error);
          return errorMessage;
        },
      }
    );
    reset(); 
  });

  return {
    onAuthenticateUser,
    isLoading,
    register,
    errors,
  };
}
