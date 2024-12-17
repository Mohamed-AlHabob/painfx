'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { createUpdateClinicSchema } from '@/schemas/Clinic'
import { z } from 'zod'
import { CONSTANTS } from '@/constants'
import FormGenerator from '@/components/global/form-generator'

type ClinicDetailsFormProps = {
  onSubmit: (data: z.infer<typeof createUpdateClinicSchema>) => void
}

export function ClinicDetailsForm({ onSubmit }: ClinicDetailsFormProps) {
  const { register, handleSubmit,control, formState: { errors,isLoading } } = useForm<z.infer<typeof createUpdateClinicSchema>>({
    resolver: zodResolver(createUpdateClinicSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
      {CONSTANTS.clinicForm.map((field) => (
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

