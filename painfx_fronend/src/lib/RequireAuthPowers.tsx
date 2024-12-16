'use client';

import { useAppSelector } from '@/redux/hooks';
import { Spinner } from '@/components/spinner';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { redirect } from 'next/navigation';

interface Props {
	children: React.ReactNode;
}

export default function RequireAuthPowers({ children }: Props) {
	const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);
	const { data: user, isLoading: isLoadingRetrieveUser } = useRetrieveUserQuery();


	if (user?.role == 'patient' && isAuthenticated) {
		redirect('/sign-in');
	}


	if (isLoading || isLoadingRetrieveUser) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Spinner />
			</div>
		);
	}

	return <>{children}</>;
}
