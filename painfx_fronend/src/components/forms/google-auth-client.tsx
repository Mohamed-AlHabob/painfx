'use client';

import { useSocialAuth } from "@/hooks/auth";
import { Spinner } from "../spinner";
import { useSocialAuthenticateMutation } from "@/redux/services/auth/authApiSlice";

export default function GoogleAuthClient() {
  const [googleAuthenticate] = useSocialAuthenticateMutation();
  useSocialAuth(googleAuthenticate, 'google-oauth2');

  return (
    <div className='flex justify-center items-center'>
      <Spinner />
    </div>
  );
}