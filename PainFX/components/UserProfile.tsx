import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { useGetDoctorByIdQuery } from '@/redux/services/booking/DoctorApiSlice';
import { Doctor } from '@/schemas';
import React from 'react';


type UserProfileProps = {
  userId?: string;
};

export const UserProfile = ({ userId }: UserProfileProps) => {
  const { data, isLoading, isError } = useGetDoctorByIdQuery(userId);
  const doctorData = (data as Doctor) || {};
  
  const isSelf = doctorData.user.id === userId;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>
            {doctorData.user.first_name|| ""} {doctorData?.user?.last_name || ""}
          </Text>
          <Text style={styles.email}>{doctorData.user?.email || ""}</Text>
        </View>
        <Image source={{ uri: doctorData.user.profile?.avatar as string }} style={styles.image} />
      </View>

      <Text style={styles.bio}>{doctorData.user.profile?.bio ? doctorData.user.profile?.bio : 'No bio yet'}</Text>
      <Text>
        {doctorData.user.profile?.phone_number|| ""} followers · {doctorData.user.profile?.phone_number || ""}
      </Text>

      <View style={styles.buttonRow}>
        {isSelf && (
          <>
            <Link
              href={`/(modal)/edit-profile?biostring=${
                doctorData.user.profile?.bio ? encodeURIComponent(doctorData.user.profile?.bio) : ''
              }&linkstring=${doctorData.user.profile?.bio ? encodeURIComponent(doctorData.user.profile?.bio) : ''}&userId=${
                doctorData.user?.id
              }&imageUrl=${doctorData.user.profile?.avatar ? encodeURIComponent(doctorData.user.profile?.avatar) : ''}`}
              asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit profile</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Share profile</Text>
            </TouchableOpacity>
          </>
        )}

        {!isSelf && (
          <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileTextContainer: {
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bio: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
    gap: 16,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  fullButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
