'use client'

import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { createUpdateUserProfileSchema } from '@/schemas/user-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Upload, User } from 'lucide-react'
import { CONSTANTS } from '@/constants'
import FormGenerator from '@/components/global/form-generator'

interface UserProfileStepProps {
  form: UseFormReturn<z.infer<typeof createUpdateUserProfileSchema>>
  onSubmit: () => void
}

export default function UserProfileStep({ form, onSubmit }: UserProfileStepProps) {
  const { register,control, formState: { errors,isLoading }, setValue } = form
  const [isLocating, setIsLocating] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')

  const handleAutoLocate = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setValue('geolocation', `${latitude},${longitude}`)
          setIsLocating(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLocating(false)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      setIsLocating(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setAvatarPreview(base64String)
        setValue('avatar', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <h5 className="font-bold text-base ">Create Profile</h5>
         <p className=" leading-tight">Protect yourself from misinformation with advanced video verification.</p>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[auto,1fr] gap-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={handleAvatarChange} />
                <Label
                  htmlFor="avatar-upload"
                  className="flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  <Upload className="w-4 h-4" />
                  Upload Avatar
                </Label>
              </div>
            </div>
            <div className="space-y-4">
            {CONSTANTS.profileForm.map((field) => (
              <FormGenerator
                {...field}
                key={field.id}
                control={control}
                register={register}
                errors={errors}
                disabled={isLoading}
              />
            ))}
              <div>
                <Label htmlFor="geolocation">Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="geolocation"
                    {...register('geolocation')}
                    className="bg-background"
                    placeholder="latitude,longitude" />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAutoLocate}
                    disabled={isLocating}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {isLocating ? 'Locating...' : 'Auto Locate'}
                  </Button>
                </div>
                {errors.geolocation && (
                  <p className="text-destructive text-sm mt-1">{errors.geolocation.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <Button type="submit">
              Next
            </Button>
          </div>
        </form>
      </>
  )
}

