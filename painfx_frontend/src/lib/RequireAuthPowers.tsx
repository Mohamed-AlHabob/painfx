'use client';

import { useAppSelector } from '@/redux/hooks';
import { Spinner } from '@/components/spinner';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { redirect } from 'next/navigation';

interface Props {
	children: React.ReactNode;
}

export default function RequireAuthPowers({ children }: Props) {
	// Extracting auth state from the Redux store
	const { isLoading: authLoading, isAuthenticated } = useAppSelector(state => state.auth);

	// Fetching user details using RTK Query
	const { data: user, isLoading: userLoading } = useRetrieveUserQuery(undefined, {
		skip: !isAuthenticated, // Skip fetching if not authenticated
	});

	// Redirect unauthenticated users or users with the "patient" role
	if (!authLoading && !isAuthenticated) {
		redirect('/sign-in');
	}

	if (user && user.role === 'patient') {
		redirect('/X');
	}

	// Show loading spinner while either auth or user data is loading
	if (authLoading || userLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Spinner />
			</div>
		);
	}

	// Render children if user is authenticated and authorized
	return <>{children}</>;
}
