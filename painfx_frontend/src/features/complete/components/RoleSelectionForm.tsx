'use client'

import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { motion } from 'framer-motion'

const RoleSelectionSchema = z.object({
  role: z.enum(['patient', 'doctor', 'clinic']),
})

type RoleSelectionFormProps = {
  form: UseFormReturn<z.infer<typeof RoleSelectionSchema>>
  onSubmit: () => void
}

export function RoleSelectionForm({ form, onSubmit }: RoleSelectionFormProps) {
  const { formState: { errors } } = form

  const roleOptions = [
    { value: 'patient', label: 'Patient', icon: '👤' },
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'clinic', label: 'Clinic', icon: '🏥' },
  ]

  return (

    <form onSubmit={onSubmit} className="space-y-6">
      <RadioGroup onValueChange={(value: "patient" | "doctor" | "clinic") => form.setValue('role', value)} className="space-y-4">
        {roleOptions.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Label
              htmlFor={option.value}
              className="flex items-center p-4 border rounded-lg cursor-pointer dark:border-zinc-700 dark:hover:bg-zinc-600 transition-all duration-200"
            >
              <RadioGroupItem value={option.value} id={option.value} className="mr-4" />
              <span className="text-2xl mr-3">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
      {errors.role && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600"
        >
          {errors.role.message}
        </motion.p>
      )}
      <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out">
        Next
      </Button>
    </form>
  )
}

