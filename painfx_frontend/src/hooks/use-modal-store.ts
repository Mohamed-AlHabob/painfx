
import { Clinic, Doctor } from "@/schemas";
import { Reservation } from "@/schemas/Reservation";
import { Post } from "@/schemas/Social/post";
import { create } from "zustand";

export type ModalType = "CreateReservation" |"editPost" | "deletePost" |"ConfirmChangeStatus";

interface ModalData {
  Doctor?: Doctor;
  reservation?: Reservation;
  Status?: string;
  Clinic?: Clinic;
  DoctorId?: string;
  ClinicId?: string;
  Post?: Post;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));
