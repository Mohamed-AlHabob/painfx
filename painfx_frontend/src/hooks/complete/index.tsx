'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { extractErrorMessage } from '../error-handling'

import { createUpdateUserProfileSchema } from '@/schemas/user-profile'
import { useCreateUserProfileMutation } from '@/redux/services/booking/UserProfileApiSlice'
import { useCreatePatientMutation } from '@/redux/services/booking/PatientApiSlice'
import { useCreateDoctorMutation } from '@/redux/services/booking/DoctorApiSlice'
import { useCreateClinicMutation } from '@/redux/services/booking/ClinicApiSlice'

const roleOptions = ['patient', 'doctor', 'clinic'] as const
type Role = typeof roleOptions[number]

const RoleSelectionSchema = z.object({
  role: z.enum(roleOptions),
})

export const useComplete = () => {
  const router = useRouter()
  const [step, setStep] = useState<'profile' | 'role' | 'details'>('profile')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const [createUserProfile] = useCreateUserProfileMutation()
  const [createPatient] = useCreatePatientMutation()
  const [createDoctor] = useCreateDoctorMutation()
  const [createClinic] = useCreateClinicMutation()


  const profileForm = useForm<z.infer<typeof createUpdateUserProfileSchema>>({
    resolver: zodResolver(createUpdateUserProfileSchema),
    mode: 'onBlur',
  })

  const roleForm = useForm<z.infer<typeof RoleSelectionSchema>>({
    resolver: zodResolver(RoleSelectionSchema),
    mode: 'onBlur',
  })

  // Handle user profile creation
  const handleProfileSubmit = profileForm.handleSubmit(async (values) => {
    try {
      await toast.promise(
        createUserProfile(values).unwrap(),
        {
          loading: 'Creating user profile...',
          success: 'User profile created successfully!',
          error: (error) => extractErrorMessage(error),
        }
      )
      setStep('role')
    } catch (error) {
      console.error('Failed to create user profile:', error)
    }
  })

  // Handle role selection
  const handleRoleSubmit = roleForm.handleSubmit(async (values) => {
    setSelectedRole(values.role)
    setStep('details')
  })

  const handleDetailsSubmit = async (values: any) => {
    let createFunction
    let successMessage
    let redirectPath

    switch (selectedRole) {
      case 'patient':
        createFunction = createPatient
        successMessage = 'Patient profile created successfully!'
        redirectPath = '/X'
        break
      case 'doctor':
        createFunction = createDoctor
        successMessage = 'Doctor profile created successfully!'
        redirectPath = '/settings'
        break
      case 'clinic':
        createFunction = createClinic
        successMessage = 'Clinic profile created successfully!'
        redirectPath = '/settings'
        break
      default:
        toast.error('Invalid role selected')
        return
    }

    try {
      await toast.promise(
        createFunction(values).unwrap(),
        {
          loading: `Creating ${selectedRole} profile...`,
          success: successMessage,
          error: (error) => extractErrorMessage(error),
        }
      )
      router.push(redirectPath)
    } catch (error) {
      console.error(`Failed to create ${selectedRole} profile:`, error)
    }
  }

  return {
    step,
    selectedRole,
    profileForm,
    roleForm,
    handleProfileSubmit,
    handleRoleSubmit,
    handleDetailsSubmit,
  }
}

