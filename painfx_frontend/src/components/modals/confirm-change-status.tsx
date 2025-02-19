"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { useReservations } from "@/hooks/reservations"
import { useModalTranslation, type ModalProps } from "@/utils/modal-utils"
import { AlertTriangle } from "lucide-react"

export function ConfirmChangeStatus({ isOpen, onClose }: ModalProps) {
  const { t, modalTitles, buttonLabels } = useModalTranslation()
  const { data } = useModal()
  const { updateReservation } = useReservations()
  const [isUpdating, setIsUpdating] = useState(false)

  const reservationId = data?.reservation?.id || ""
  const status = data?.Status || "unknown"
  const reservationName = data?.reservation?.patient?.user?.first_name || t("this_reservation")

  const handleConfirm = async () => {
    if (!reservationId) {
      console.error("Reservation ID is missing.")
      return
    }
    setIsUpdating(true)
    try {
      await updateReservation(reservationId, {
        status,
        reservation_date: data?.reservation?.reservation_date || "",
        reservation_time: data?.reservation?.reservation_time || "",
      })
      onClose()
    } catch (error) {
      console.error("Failed to update reservation status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {modalTitles.changeStatus}
          </DialogTitle>
          <DialogDescription>
            {t("confirm_change_status")} <br />
            <span className="font-semibold">{reservationName}</span> {t("to_status")}{" "}
            <span className="font-semibold">{status}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            {buttonLabels.cancel}
          </Button>
          <Button onClick={handleConfirm} disabled={isUpdating}>
            {isUpdating ? buttonLabels.updating : buttonLabels.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

