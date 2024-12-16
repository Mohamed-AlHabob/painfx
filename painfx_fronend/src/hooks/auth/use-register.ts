import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { extractErrorMessage } from '../error-handling';
import { useRegisterMutation } from '@/redux/services/auth/authApiSlice';
import { SignUpSchema } from '@/schemas/auth';

export default function useRegister() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onBlur',
  });

  const onRegisterUser = handleSubmit(async (values) => {
    toast.promise(
      registerUser({ ...values }).unwrap(),
      {
        loading: "Creating your account...",
        success: () => {
          reset();
          router.push('/sign-in');
          return "Please check your email to verify your account.";
        },
        error: (error) => {
          const errorMessage = extractErrorMessage(error);
          return errorMessage;
        },
        },
    );
  });

  return {
    register,
    onRegisterUser,
    isLoading,
    errors,
  };
}
