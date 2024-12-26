"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useReservations } from "@/hooks/reservations";
import { useTranslation } from "react-i18next";

export function CreateReservationDrawer() {
  const { t } = useTranslation();
  const { isOpen, onClose, type, data } = useModal();
  const { onCreateReservation, isCreating, register, errors } = useReservations();

  const isModalOpen = isOpen && type === "CreateReservation";
  const DoctorId = data?.DoctorId || "";
  const ClinicId = data?.ClinicId || "";
  const entityType = DoctorId ? "doctor" : "clinic";
  const entityValue = DoctorId || ClinicId;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateReservation();
    onClose();
  };

  return (
    <Drawer open={isModalOpen} onOpenChange={onClose}>
      <DrawerContent className="overflow-hidden">
        {/* Responsive Container */}
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <DrawerHeader>
            <DrawerTitle>{t("create_reservation")}</DrawerTitle>
            <DrawerDescription>{t("fill_details")}</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reservation Date */}
            <div className="flex flex-col">
              <Label htmlFor="reservation_date" className="mb-1">
                {t("reservation_date")}
              </Label>
              <Input
                id="reservation_date"
                type="date"
                {...register("reservation_date", { required: t("reservation_date_required") })}
                className={`w-full ${errors.reservation_date ? "border-red-500" : ""}`}
              />
              {errors.reservation_date && (
                <p className="text-red-500 text-sm mt-1">{errors.reservation_date.message}</p>
              )}
            </div>

            {/* Reservation Time */}
            <div className="flex flex-col">
              <Label htmlFor="reservation_time" className="mb-1">
                {t("reservation_time")}
              </Label>
              <Input
                id="reservation_time"
                type="time"
                {...register("reservation_time", { required: t("reservation_time_required") })}
                className={`w-full ${errors.reservation_time ? "border-red-500" : ""}`}
              />
              {errors.reservation_time && (
                <p className="text-red-500 text-sm mt-1">{errors.reservation_time.message}</p>
              )}
            </div>

            {/* Hidden Entity ID Fields */}
            <div className="hidden">
              <Label htmlFor={entityType} className="mb-1">
                {t(DoctorId ? "doctor_id" : "clinic_id")}
              </Label>
              <Input
                id={entityType}
                defaultValue={entityValue}
                type="text"
                {...register(entityType as "id", { required: `${t(entityType)} is required` })}
                className={`w-full ${errors[entityType as keyof typeof errors] ? "border-red-500" : ""}`}
                readOnly
              />
              {errors[entityType as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[entityType as keyof typeof errors]?.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <DrawerFooter className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" className="w-full sm:w-auto flex-1" disabled={isCreating}>
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
                <Button variant="outline" className="w-full sm:w-auto flex-1" onClick={onClose}>
                  {t("cancel")}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
