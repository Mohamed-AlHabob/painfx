"use client";

import { useState } from "react";
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
import { Loader2, Calendar, Clock } from 'lucide-react';
import { useModal } from "@/hooks/use-modal-store";
import { useReservations } from "@/hooks/reservations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CreateReservationDrawer() {
  const { isOpen, onClose, type, data } = useModal();
  const { onCreateReservation, isCreating } = useReservations();
  const [formData, setFormData] = useState({
    reservation_date: "",
    reservation_time: "",
  });
  const [errors, setErrors] = useState({
    reservation_date: "",
    reservation_time: "",
  });
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const isModalOpen = isOpen && type === "CreateReservation";
  const DoctorId = data?.DoctorId || "";
  const ClinicId = data?.ClinicId || "";
  const entityType = DoctorId ? "doctor" : "clinic";
  const entityValue = DoctorId || ClinicId;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateReservation();
    onClose(); 
  };

  const handleClose = () => {
    if (formData.reservation_date || formData.reservation_time) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  return (
    <Drawer open={isModalOpen} onOpenChange={handleClose}>
      <DrawerContent className="sm:max-w-[425px] mx-auto">
        <div className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Create Reservation</DrawerTitle>
            <DrawerDescription>
              Fill in the details to create a new reservation.
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reservation_date" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Reservation Date
              </Label>
              <Input
                id="reservation_date"
                name="reservation_date"
                type="date"
                value={formData.reservation_date}
                onChange={handleInputChange}
                className={errors.reservation_date ? "border-red-500" : ""}
              />
              {errors.reservation_date && (
                <p className="text-red-500 text-sm">{errors.reservation_date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservation_time" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Reservation Time
              </Label>
              <Input
                id="reservation_time"
                name="reservation_time"
                type="time"
                value={formData.reservation_time}
                onChange={handleInputChange}
                className={errors.reservation_time ? "border-red-500" : ""}
              />
              {errors.reservation_time && (
                <p className="text-red-500 text-sm">{errors.reservation_time}</p>
              )}
            </div>
            <div className="space-y-2 hidden">
              <Label htmlFor={entityType}>
                {DoctorId ? "Doctor ID" : "Clinic ID"}
              </Label>
              <Input
                id={entityType}
                name={entityType}
                defaultValue={entityValue}
                type="text"
                readOnly
              />
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
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
        {showConfirmClose && (
          <Alert className="mt-4 mx-4">
            <AlertTitle>Unsaved Changes</AlertTitle>
            <AlertDescription>
              You have unsaved changes. Are you sure you want to close?
            </AlertDescription>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowConfirmClose(false)}>
                Continue Editing
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowConfirmClose(false);
                  setFormData({ reservation_date: "", reservation_time: "" });
                  onClose();
                }}
              >
                Close Without Saving
              </Button>
            </div>
          </Alert>
        )}
      </DrawerContent>
    </Drawer>
  );
}

