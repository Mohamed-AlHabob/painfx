'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { createUpdateDoctorSchema } from '@/schemas/Doctor'
import { z } from 'zod'
import FormGenerator from '@/components/global/form-generator'
import { CONSTANTS } from '@/constants'

type DoctorDetailsFormProps = {
  onSubmit: (data: z.infer<typeof createUpdateDoctorSchema>) => void
}

export function DoctorDetailsForm({ onSubmit }: DoctorDetailsFormProps) {
  const { register, handleSubmit,control, formState: { errors,isLoading } } = useForm<z.infer<typeof createUpdateDoctorSchema>>({
    resolver: zodResolver(createUpdateDoctorSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
      {CONSTANTS.doctorForm.map((field) => (
              <FormGenerator
                {...field}
                key={field.id}
                label={field.label}
                control={control}
                register={register}
                errors={errors}
                disabled={isLoading}
              />
            ))}
      </div>
      <Button type="submit" className="w-full">Complete Profile</Button>
    </form>
  )
}

