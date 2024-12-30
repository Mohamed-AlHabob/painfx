import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BookmarkPlus, MapPin, Building } from 'lucide-react-native';
import { colors, fontSizes, spacing, borderRadius } from '../config/theme';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    logo: string;
    postedAt: string;
    applicants: number;
  };
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <TouchableOpacity style={styles.jobCard}>
      <Image 
        source={{ uri: job.logo }}
        style={styles.companyLogo}
      />
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={styles.companyInfo}>
          <Building size={16} color={colors.text.secondary} />
          <Text style={styles.companyName}>{job.company}</Text>
        </View>
        <View style={styles.locationInfo}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.location}>{job.location}</Text>
        </View>
        <Text style={styles.applicants}>
          {job.applicants} applicants • {job.postedAt}
        </Text>
      </View>
      <TouchableOpacity style={styles.saveButton}>
        <BookmarkPlus size={20} color={colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  jobCard: {
    flexDirection: 'row',
    paddingVertical: spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.small,
  },
  jobInfo: {
    flex: 1,
    marginLeft: spacing.medium,
  },
  jobTitle: {
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small / 2,
  },
  companyName: {
    marginLeft: spacing.small / 2,
    color: colors.text.secondary,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small / 2,
  },
  location: {
    marginLeft: spacing.small / 2,
    color: colors.text.secondary,
  },
  applicants: {
    marginTop: spacing.small / 2,
    fontSize: fontSizes.small,
    color: colors.text.secondary,
  },
  saveButton: {
    padding: spacing.small,
  },
});

