'use client';

import { redirect } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { Spinner } from '@/components/spinner';

interface Props {
	children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
	const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Spinner />
			</div>
		);
	}

	if (!isAuthenticated) {
		redirect('/sign-in');
	}

	return <>{children}</>;
}
