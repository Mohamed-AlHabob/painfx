'use client'

import { useComplete } from "@/hooks/complete"
import UserProfileStep from "./UserProfileForm"
import { PatientDetailsForm } from "./PatientDetailsForm"
import { DoctorDetailsForm } from "./DoctorDetailsForm"
import { ClinicDetailsForm } from "./ClinicDetailsForm"
import { RoleSelectionForm } from "./RoleSelectionForm"



export default function LoginCompletionPage() {
  const {
    step,
    selectedRole,
    profileForm,
    roleForm,
    handleProfileSubmit,
    handleRoleSubmit,
    handleDetailsSubmit,
  } = useComplete()

  return (
    <>
      {step === 'role' && (
        <UserProfileStep
          form={profileForm}
          onSubmit={handleProfileSubmit}
        />
      )}
      {step === 'profile' && (
        <RoleSelectionForm
          form={roleForm}
          onSubmit={handleRoleSubmit}
        />
      )}
      {step === 'details' && selectedRole === 'patient' && (
        <PatientDetailsForm onSubmit={handleDetailsSubmit} />
      )}
      {step === 'details' && selectedRole === 'doctor' && (
        <DoctorDetailsForm onSubmit={handleDetailsSubmit} />
      )}
      {step === 'details' && selectedRole === 'clinic' && (
        <ClinicDetailsForm onSubmit={handleDetailsSubmit} />
      )}
      </>
  )
}

