import { useTranslation } from "react-i18next"

export const useModalTranslation = () => {
  const { t } = useTranslation()
  return {
    t,
    modalTitles: {
      changeStatus: t("change_reservation_status"),
      deletePost: t("delete_post"),
      createReservation: t("create_reservation"),
    },
    buttonLabels: {
      cancel: t("cancel"),
      confirm: t("confirm"),
      updating: t("updating"),
      deleting: t("deleting"),
      creating: t("creating"),
    },
  }
}

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

