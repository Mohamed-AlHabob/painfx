import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { ModalType, useModal } from "@/hooks/use-modal-store"

type GlassModalProps = {
  children: React.ReactNode
  title: string
  description: string
  descriptionillustrative?: string
  onClick?: () => void
  isLoading?: boolean
  modalType: ModalType
}

export const GlassModal = ({
  children,
  title,
  description,
  descriptionillustrative = "",
  onClick = () => {},
  isLoading = false,
  modalType
}: GlassModalProps) => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === modalType;


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-clip-padding backdrop-filter backdrop--blur__safari backdrop-blur-3xl bg-opacity-10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}<br />
            <span className="text-indigo-500 font-semibold">{descriptionillustrative}</span>
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className=" px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClick}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
