"use client";

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

export function CreateReservationDrawer() {
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
        <div className="mx-56">
        <DrawerHeader>
          <DrawerTitle>Create Reservation</DrawerTitle>
          <DrawerDescription>
            Fill in the details to create a new reservation.
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reservation_date">Reservation Date</Label>
            <Input
              id="reservation_date"
              type="date"
              {...register("reservation_date", { required: "Reservation date is required" })}
              className={errors.reservation_date ? "border-red-500" : ""}
            />
            {errors.reservation_date && (
              <p className="text-red-500 text-sm">{errors.reservation_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reservation_time">Reservation Time</Label>
            <Input
              id="reservation_time"
              type="time"
              {...register("reservation_time", { required: "Reservation time is required" })}
              className={errors.reservation_time ? "border-red-500" : ""}
            />
            {errors.reservation_time && (
              <p className="text-red-500 text-sm">{errors.reservation_time.message}</p>
            )}
          </div>
          <div className="space-y-2 hidden">
            <Label htmlFor={entityType}>
              {DoctorId ? "Doctor ID" : "Clinic ID"}
            </Label>
            <Input
              id={entityType}
              defaultValue={entityValue}
              type="text"
              {...register(entityType as "id", { required: `${entityType} is required` })}
              className={errors[entityType as keyof typeof errors] ? "border-red-500" : ""}
              readOnly 
            />
            {errors[entityType as keyof typeof errors] && (
              <p className="text-red-500 text-sm">{errors[entityType as keyof typeof errors]?.message}</p>
            )}
          </div>
          <DrawerFooter>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Reservation"
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}