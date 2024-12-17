"use client"
import  FormGenerator  from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { CONSTANTS } from "@/constants"
import { useRegister } from "@/hooks/auth"

const SignUpForm = () => {
    const {	onRegisterUser,isLoading,register,errors} = useRegister()
    return (
        <form className="flex flex-col gap-3 mt-10" onSubmit={onRegisterUser}>
          {CONSTANTS.signUpForm.map((field) => (
            <FormGenerator
              {...field}
              key={field.id}
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          ))}
          <Button disabled={isLoading} type="submit" className="rounded-2xl" variant={"outline"}>
            <Loader loading={isLoading}>Sign Up with Email</Loader>
          </Button>
        </form>
  )
}

export default SignUpForm
