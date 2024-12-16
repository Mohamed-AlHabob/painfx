'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { createUpdatePatientSchema } from '@/schemas/Patient'
import { z } from 'zod'
import FormGenerator from '@/components/global/form-generator'
import { CONSTANTS } from '@/constants'

type PatientDetailsFormProps = {
  onSubmit: (data: z.infer<typeof createUpdatePatientSchema>) => void
}

export function PatientDetailsForm({ onSubmit }: PatientDetailsFormProps) {
  const { register, handleSubmit,control, formState: { errors,isLoading } } = useForm<z.infer<typeof createUpdatePatientSchema>>({
    resolver: zodResolver(createUpdatePatientSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
      {CONSTANTS.patienForm.map((field) => (
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

