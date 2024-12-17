
import ActivitingConfirmForm from '@/components/forms/activating/activating-form-confirm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'PainFX | Password Reset Confirm',
	description: 'PainFX password reset confirm page',
};

type Props = {
	params: Promise<{ uid: string ,token:string}>
	
  }
export default async function ActivatingPage({  params  }: Props) {
  const uid = (await params).uid
  const token = (await params).token


	return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <ActivitingConfirmForm uid={uid} token={token}/>
    </div>
	);
}
