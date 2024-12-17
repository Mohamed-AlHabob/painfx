import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { extractErrorMessage } from '../error-handling';
import { useResetPasswordConfirmMutation } from '@/redux/services/auth/authApiSlice';
import { RestPassworduseConfirmSchema } from '@/schemas/auth';

export default function useResetPasswordConfirm(uid: string, token: string) {
  const router = useRouter();
  const [resetPasswordConfirm, { isLoading }] = useResetPasswordConfirmMutation();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof RestPassworduseConfirmSchema>>({
    resolver: zodResolver(RestPassworduseConfirmSchema),
    mode: 'onBlur',
  });



  const onResetPasswordConfirm = handleSubmit(async (values) => {
    toast.promise(
      resetPasswordConfirm({ uid, token, ...values }).unwrap(),
      {
        loading: 'Resetting your password...',
        success: () => {
          reset();
          router.push('/sign-in');
          return 'Password reset successful! You can now log in with your new password.';
        },
        error: (error) => {
			const errorMessage = extractErrorMessage(error);
			return errorMessage;
		  },
      }
    );
  });

  return {
    onResetPasswordConfirm,
    register,
    isLoading,
    errors,
  };
}
