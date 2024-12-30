import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface Reservation {
  id: string;
  status: string;
  reservation_date: string;
  reservation_time: string;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedReservations = await AsyncStorage.getItem('reservations');
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch reservations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = useCallback(async (newReservation: Omit<Reservation, 'id'>) => {
    setIsLoading(true);
    try {
      const id = Date.now().toString();
      const reservationWithId = { ...newReservation, id };
      const updatedReservations = [...reservations, reservationWithId];
      await AsyncStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      Alert.alert('Success', 'Reservation created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create reservation');
    } finally {
      setIsLoading(false);
    }
  }, [reservations]);

  const updateReservation = useCallback(async (id: string, updatedData: Partial<Reservation>) => {
    setIsLoading(true);
    try {
      const updatedReservations = reservations.map(reservation =>
        reservation.id === id ? { ...reservation, ...updatedData } : reservation
      );
      await AsyncStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      Alert.alert('Success', 'Reservation updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update reservation');
    } finally {
      setIsLoading(false);
    }
  }, [reservations]);

  const deleteReservation = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const updatedReservations = reservations.filter(reservation => reservation.id !== id);
      await AsyncStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      Alert.alert('Success', 'Reservation deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete reservation');
    } finally {
      setIsLoading(false);
    }
  }, [reservations]);

  return {
    reservations,
    isLoading,
    createReservation,
    updateReservation,
    deleteReservation,
  };
};

