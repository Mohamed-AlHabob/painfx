"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetReservationsQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
} from "@/redux/services/booking/ReservationApiSlice";
import { createUpdateReservationSchema } from "@/schemas/Reservation";
import { useCallback } from "react";
import { extractErrorMessage } from "../error-handling";

interface ReservationFormValues {
  id?: string;
  status: string,
  reservation_date: string,
  reservation_time: string,
}

export const useReservations = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(createUpdateReservationSchema),
  });

  const { data: reservations,refetch:refetchReservations, isLoading: isLoadingReservations, error: reservationsError } = useGetReservationsQuery("");

  const [createReservation, { isLoading: isCreating }] = useCreateReservationMutation();
  const [updateReservationMutation, { isLoading: isUpdating }] = useUpdateReservationMutation();
  const [deleteReservation, { isLoading: isDeleting }] = useDeleteReservationMutation();

  const onCreateReservation = useCallback(handleSubmit(async (values) => {
    try {
      await toast.promise(
        createReservation(values).unwrap(),
        {
          loading: "Creating reservation...",
          success: async () => {
            reset();
            await refetchReservations();
            return "Reservation created successfully!";
          },
          error: (error) => extractErrorMessage(error),
        }
      );
      reset();
    } catch (error:any) {
      toast.error(extractErrorMessage(error));
    }
  }), [createReservation, reset]);

  const onUpdateReservation = useCallback(handleSubmit(async ({ id, ...values }) => {
    try {
      await toast.promise(
        updateReservationMutation({ id, ...values }).unwrap(),
        {
          loading: "Updating reservation...",
          success: async () => {
            reset();
            await refetchReservations();
            return "Reservation updated successfully!";
          },
          error: (error) => extractErrorMessage(error),
        }
      );
      reset();
    } catch (error:any) {
      toast.error(extractErrorMessage(error));
    }
  }), [updateReservationMutation, reset]);

  const updateReservation = useCallback(async (id: string, values: Partial<ReservationFormValues>) => {
    try {
      await toast.promise(
        updateReservationMutation({ id, ...values }).unwrap(),
        {
          loading: "Updating reservation...",
          success: async () => {
            reset();
            await refetchReservations();
            return "Reservation updated successfully!";
          },
          error: (error) => extractErrorMessage(error),
        }
      );
    } catch (error:any) {
      toast.error(extractErrorMessage(error));
      throw error;
    }
  }, [updateReservationMutation]);

  const onDeleteReservation = useCallback(async (id: string) => {
    try {
      await toast.promise(
        deleteReservation(id).unwrap(),
        {
          loading: "Deleting reservation...",
          success: async () => {
            reset();
            await refetchReservations();
            return "Reservation deleted successfully!";
          },
          error: (error) => extractErrorMessage(error),
        }
      );
    } catch (error:any) {
      toast.error(extractErrorMessage(error));
    }
  }, [deleteReservation]);

  const isLoading = isCreating || isUpdating || isDeleting || isLoadingReservations;

  return {
    reservations,
    isLoadingReservations,
    reservationsError,
    isCreating,
    isUpdating,
    isDeleting,
    isLoading,
    onCreateReservation,
    onUpdateReservation, 
    updateReservation,
    onDeleteReservation,
    register,
    errors,
  };
};