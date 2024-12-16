import SignInForm from "@/components/forms/sign-in"
import { GoogleAuthButton } from "@/components/global/google-oauth-button"
import { Separator } from "@/components/ui/separator"

import Link from "next/link"

const SignInPage = () => {
  return (
    <>
      <h5 className="font-bold text-base ">Login</h5>
      <p className=" leading-tight">
      Protect yourself from misinformation with advanced video verification.
      </p>
      <SignInForm />
      <div className="my-10 w-full relative">
        <div className=" p-3 absolute text-xs top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          OR CONTINUE WITH
        </div>
        <Separator orientation="horizontal" className="bg-themeGray" />
      </div>
      <GoogleAuthButton />
      <p className='mt-5 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link
						href='/sign-up'
						className='font-semibold leading-6 text-indigo-600 hover:text-indigo-800'
					>
						Register here
					</Link>
				</p>
    </>
  )
}

export default SignInPage
