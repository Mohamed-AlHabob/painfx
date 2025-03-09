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
import { useTranslation } from "react-i18next";

export function ConfirmChangeStatus() {
  const { t } = useTranslation();
  const { isOpen, onClose, type, data } = useModal();
  const { updateReservation, isUpdating } = useReservations();
  const isModalOpen = isOpen && type === "ConfirmChangeStatus";

  const reservationId = data?.reservation?.id || "";
  const status = data?.Status || "unknown"; // Ensure correct casing
  const reservationName =
    data?.reservation?.patient?.user?.first_name || t("this_reservation");
  const reservationDate =
    data?.reservation?.time_slot?.start_time || t("this_reservation_date");
  const reservationTime =
    data?.reservation?.time_slot?.end_time || t("this_reservation_time");

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
            {t("change_reservation_status")}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t("confirm_change_status")} <br />
            <span className="text-indigo-500 font-semibold">
              {reservationName}
            </span>{" "}
            {t("to_status")}{" "}
            <span className="text-indigo-500 font-semibold">{status}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isUpdating} onClick={onClose} variant="ghost">
              {t("cancel")}
            </Button>
            <Button disabled={isUpdating} onClick={handleConfirm}>
              {isUpdating ? t("updating") : t("confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
