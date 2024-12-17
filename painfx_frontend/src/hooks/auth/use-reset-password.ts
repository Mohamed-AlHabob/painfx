import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { extractErrorMessage } from '../error-handling';
import { useResetPasswordMutation } from '@/redux/services/auth/authApiSlice';
import { RestPasswordSchema } from '@/schemas/auth';
export default function useResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof RestPasswordSchema>>({
    resolver: zodResolver(RestPasswordSchema),
    mode: 'onBlur',
  });

  const onResetPassword = handleSubmit(async (values) => {
    toast.promise(
      resetPassword(values).unwrap(),
      {
        loading: 'Sending reset request...',
        success: () => {
          reset();
          return 'Request sent! Please check your email for the reset link.';
        },
        error: (error) => {
			const errorMessage = extractErrorMessage(error);
			return errorMessage;
		  },
      }
    );
  });

  return {
    onResetPassword,
    isLoading,
    register,
    errors,
  };
}
