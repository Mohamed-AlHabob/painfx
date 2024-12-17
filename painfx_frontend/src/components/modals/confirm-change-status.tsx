"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useReservations } from "@/hooks/reservations";

export function ConfirmChangeStatus() {
  const { isOpen, onClose, type, data } = useModal();
  const { updateReservation, isUpdating } = useReservations();
  const isModalOpen = isOpen && type === "ConfirmChangeStatus";

  const reservationId = data?.reservation?.id || "";
  const status = data?.Status || "unknown"; // Ensure correct casing
  const reservationName =
    data?.reservation?.patient?.user?.first_name || "this reservation";
  const reservationDate =
    data?.reservation?.reservation_date || "this reservation date";
  const reservationTime =
    data?.reservation?.reservation_time || "this reservation time";

  const handleConfirm = async () => {
    if (!reservationId) {
      console.error("Reservation ID is missing.");
      return;
    }
    const values = {
      status: status,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      
    };

    try {
      await updateReservation(reservationId, values);
      onClose();
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Change Reservation Status
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to change the status of <br />
            <span className="text-indigo-500 font-semibold">
              {reservationName}
            </span>{" "}
            to <span className="text-indigo-500 font-semibold">{status}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isUpdating} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isUpdating}
              onClick={handleConfirm}
            >
              {isUpdating ? "Updating..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
