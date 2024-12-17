"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { CONSTANTS } from "@/constants"
import { useLogin } from "@/hooks/auth"

import Link from "next/link"
import  FormGenerator  from "../global/form-generator"

const SignInForm = () => {
const {	onAuthenticateUser,isLoading,register,errors} = useLogin()
  return (
    <form className="flex flex-col gap-3 mt-10" onSubmit={onAuthenticateUser}>
      {CONSTANTS.signInForm.map((field) => (
        <FormGenerator
          {...field}
          key={field.id}
          register={register}
          errors={errors}
          disabled={isLoading}
          type={field.type}
        />
      ))}
        <Link className="text-sm " href="/password-reset">
           Forgot password ?
        </Link>
      <Button disabled={isLoading} type="submit" className="rounded-2xl" variant={"outline"}>
        <Loader loading={isLoading}>Sign In with Email</Loader>
      </Button>
    </form>
  )
}

export default SignInForm
