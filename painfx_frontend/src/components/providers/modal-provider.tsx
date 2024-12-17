"use client";

import { useEffect, useState } from "react";
import { CreateReservationDrawer } from "../modals/create-reservation-drawer";
import { ConfirmChangeStatus } from "../modals/confirm-change-status";
import { ConfirmDeletePost } from "../modals/confirm-delete-post";
import { EditPostModal } from "../modals/Edite-post";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
    <EditPostModal/>
    <ConfirmDeletePost/>
    <ConfirmChangeStatus/>
    <CreateReservationDrawer/>
    </>
  )
}