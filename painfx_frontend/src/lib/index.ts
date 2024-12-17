import continueWithSocialAuth from './continue-with-social-auth';
import { cn } from './utils';

export const continueWithGoogle = () =>
	continueWithSocialAuth('google-oauth2', 'google');
export const continueWithFacebook = () =>
	continueWithSocialAuth('facebook', 'facebook');


export {
	cn,
}