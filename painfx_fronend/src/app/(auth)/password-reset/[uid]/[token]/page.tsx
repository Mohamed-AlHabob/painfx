import PasswordResetConfirmForm from '@/components/forms/password_rest/PasswordResetformConfirm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'PainFX | Password Reset Confirm',
	description: 'PainFX password reset confirm page',
};

type Props = {
	params: Promise<{ uid: string ,token:string}>
	
  }
export default async function ResetPasswordPage({  params  }: Props) {
	const uid = (await params).uid
	const token = (await params).token

	return (
		<>
		<h5 className="font-bold text-base text-themeTextWhite">Login</h5>
		<p className="text-themeTextGray leading-tight">
		Protect yourself from misinformation with advanced video verification.
		</p>
		<PasswordResetConfirmForm uid={uid} token={token} />
		</>
	);
}
