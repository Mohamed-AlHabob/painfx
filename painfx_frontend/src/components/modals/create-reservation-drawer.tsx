"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useModal } from "@/hooks/use-modal-store"
import { useReservations } from "@/hooks/reservations"

const formSchema = z.object({
  reservation_date: z.string().nonempty("Reservation date is required"),
  reservation_time: z.string().nonempty("Reservation time is required"),
  entityId: z.string().nonempty("Entity ID is required"),
})

type FormValues = z.infer<typeof formSchema>

export function CreateReservationDrawer() {
  const { t } = useTranslation()
  const { isOpen, onClose, type, data } = useModal()
  const { onCreateReservation, isCreating } = useReservations()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reservation_date: "",
      reservation_time: "",
      entityId: data?.DoctorId || data?.ClinicId || "",
    },
  })

  const isModalOpen = isOpen && type === "CreateReservation"
  const entityType = data?.DoctorId ? "doctor" : "clinic"

  const handleSubmit = (values: FormValues) => {
    onCreateReservation(values)
    onClose()
  }

  return (
    <Drawer open={isModalOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg px-6">
          <DrawerHeader>
            <DrawerTitle>{t("create_reservation")}</DrawerTitle>
            <DrawerDescription>{t("fill_details")}</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="reservation_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("reservation_date")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reservation_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("reservation_time")}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>{t(entityType === "doctor" ? "doctor_id" : "clinic_id")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter className="px-0">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button type="submit" className="flex-1" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("creating")}
                      </>
                    ) : (
                      t("create_reservation_button")
                    )}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                      {t("cancel")}
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

