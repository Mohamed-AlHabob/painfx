"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"
import { useReservations } from "@/hooks/reservations"
import { useModalTranslation, type ModalProps } from "@/utils/modal-utils"

const reservationSchema = z.object({
  reservation_date: z.string().nonempty("Reservation date is required"),
  reservation_time: z.string().nonempty("Reservation time is required"),
  entityId: z.string().nonempty("Entity ID is required"),
})

type ReservationFormValues = z.infer<typeof reservationSchema>

export function CreateReservationDrawer({ isOpen, onClose }: ModalProps) {
  const { t, modalTitles, buttonLabels } = useModalTranslation()
  const { data } = useModal()
  const { onCreateReservation } = useReservations()
  const [isCreating, setIsCreating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
  })

  const DoctorId = data?.DoctorId || ""
  const ClinicId = data?.ClinicId || ""
  const entityType = DoctorId ? "doctor" : "clinic"
  const entityValue = DoctorId || ClinicId

  const onSubmit = async (formData: ReservationFormValues) => {
    setIsCreating(true)
    try {
      await onCreateReservation({
        ...formData,
        [entityType]: formData.entityId,
      })
      onClose()
    } catch (error) {
      console.error("Failed to create reservation:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="max-w-md mx-auto p-6">
          <DrawerHeader>
            <DrawerTitle>{modalTitles.createReservation}</DrawerTitle>
            <DrawerDescription>{t("fill_details")}</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reservation_date">{t("reservation_date")}</Label>
              <Input
                id="reservation_date"
                type="date"
                {...register("reservation_date")}
                className={errors.reservation_date ? "border-red-500" : ""}
              />
              {errors.reservation_date && <p className="text-red-500 text-sm">{errors.reservation_date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation_time">{t("reservation_time")}</Label>
              <Input
                id="reservation_time"
                type="time"
                {...register("reservation_time")}
                className={errors.reservation_time ? "border-red-500" : ""}
              />
              {errors.reservation_time && <p className="text-red-500 text-sm">{errors.reservation_time.message}</p>}
            </div>

            <Input type="hidden" {...register("entityId")} value={entityValue} />

            <DrawerFooter>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {buttonLabels.creating}
                  </>
                ) : (
                  t("create_reservation_button")
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  {buttonLabels.cancel}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}