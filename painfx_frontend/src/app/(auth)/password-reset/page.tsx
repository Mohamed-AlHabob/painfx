import PasswordResetForm from '@/components/forms/password_rest/PasswordResetform';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Full Auth | Password Reset',
	description: 'Full Auth password reset page',
};

export default function Page() {
	return (
		<>
		<h5 className="font-bold text-lg ">Rest Password</h5>
		<p className="leading-tight">
		 Enter your email and you will receive a link to reset your password..
		</p>
		<PasswordResetForm />
		</>
	);
}
