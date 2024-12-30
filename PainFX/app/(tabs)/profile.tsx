import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Edit3, MapPin, Briefcase, School, Plus } from 'lucide-react-native';
import { Header } from '../../components/header';
import { colors, fontSizes, spacing, borderRadius } from '../../config/theme';
import { RootState } from '@/redux/store';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';


export default function ProfileScreen() {
    const { data: user, isLoading,isFetching } = useRetrieveUserQuery();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.coverPhoto}>
          <Image
            source={{ uri: '/placeholder.svg?height=200&width=400' }}
            style={styles.coverImage}
          />
          <TouchableOpacity style={styles.editCoverButton}>
            <Edit3 size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: user?.profile?.avatar || '/placeholder.svg?height=120&width=120' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editProfileButton}>
            <Edit3 size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.name}>{user?.first_name || 'Your Name'}</Text>
          <Text style={styles.headline}>{user?.profile?.address || 'Your Headline'}</Text>
          <View style={styles.locationCompany}>
            <MapPin size={16} color={colors.text.secondary} />
            <Text style={styles.locationCompanyText}>{user?.profile?.address || "San Francisco Bay Area"}</Text>
          </View>
          <View style={styles.locationCompany}>
            <Briefcase size={16} color={colors.text.secondary} />
            <Text style={styles.locationCompanyText}>LinkedIn</Text>
          </View>
          <TouchableOpacity style={styles.editIntroButton}>
            <Text style={styles.editIntroText}>Edit intro</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Passionate about connecting professionals and creating opportunities. 
            Building the world's largest professional network.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.experienceItem}>
            <Image
              source={{ uri: '/placeholder.svg?height=48&width=48' }}
              style={styles.companyLogo}
            />
            <View style={styles.experienceInfo}>
              <Text style={styles.experienceTitle}>Software Engineer</Text>
              <Text style={styles.experienceCompany}>LinkedIn</Text>
              <Text style={styles.experienceDuration}>Jan 2020 - Present · 3 yrs 6 mos</Text>
              <Text style={styles.experienceLocation}>San Francisco Bay Area</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.educationItem}>
            <School size={48} color={colors.text.secondary} />
            <View style={styles.educationInfo}>
              <Text style={styles.educationSchool}>Stanford University</Text>
              <Text style={styles.educationDegree}>Master of Science - MS, Computer Science</Text>
              <Text style={styles.educationYears}>2018 - 2020</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.skillItem}>
            <Text style={styles.skillName}>React Native</Text>
            <Text style={styles.skillEndorsements}>7 endorsements</Text>
          </View>
          <View style={styles.skillItem}>
            <Text style={styles.skillName}>JavaScript</Text>
            <Text style={styles.skillEndorsements}>15 endorsements</Text>
          </View>
          <View style={styles.skillItem}>
            <Text style={styles.skillName}>Node.js</Text>
            <Text style={styles.skillEndorsements}>10 endorsements</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  coverPhoto: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    right: spacing.medium,
    bottom: spacing.medium,
    backgroundColor: colors.white,
    borderRadius: borderRadius.round,
    padding: spacing.small,
  },
  profileInfo: {
    alignItems: 'center',
    padding: spacing.large,
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    borderWidth: 3,
    borderColor: colors.white,
    marginTop: -60,
  },
  editProfileButton: {
    position: 'absolute',
    right: spacing.large,
    top: spacing.large,
    backgroundColor: colors.white,
    borderRadius: borderRadius.round,
    padding: spacing.small,
  },
  name: {
    fontSize: fontSizes.xxlarge,
    fontWeight: 'bold',
    marginTop: spacing.medium,
  },
  headline: {
    fontSize: fontSizes.large,
    color: colors.text.secondary,
    marginTop: spacing.small,
    textAlign: 'center',
  },
  locationCompany: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
  },
  locationCompanyText: {
    marginLeft: spacing.small,
    fontSize: fontSizes.medium,
    color: colors.text.secondary,
  },
  editIntroButton: {
    marginTop: spacing.medium,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editIntroText: {
    color: colors.primary,
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.white,
    marginTop: spacing.medium,
    padding: spacing.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: fontSizes.medium,
    lineHeight: fontSizes.large * 1.4,
    color: colors.text.primary,
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.small,
  },
  experienceInfo: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  experienceTitle: {
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  experienceCompany: {
    fontSize: fontSizes.medium,
    color: colors.text.secondary,
    marginTop: spacing.small / 2,
  },
  experienceDuration: {
    fontSize: fontSizes.small,
    color: colors.text.secondary,
    marginTop: spacing.small / 2,
  },
  experienceLocation: {
    fontSize: fontSizes.small,
    color: colors.text.secondary,
    marginTop: spacing.small / 2,
  },
  educationItem: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  educationInfo: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  educationSchool: {
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  educationDegree: {
    fontSize: fontSizes.medium,
    color: colors.text.secondary,
    marginTop: spacing.small / 2,
  },
  educationYears: {
    fontSize: fontSizes.small,
    color: colors.text.secondary,
    marginTop: spacing.small / 2,
  },
  addButton: {
    padding: spacing.small,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  skillName: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
  skillEndorsements: {
    fontSize: fontSizes.small,
    color: colors.text.secondary,
  },
});
