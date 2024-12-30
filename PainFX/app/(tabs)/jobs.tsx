import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Search, BookmarkPlus, MapPin, Building } from 'lucide-react-native';
import { colors, fontSizes, spacing, borderRadius } from '../../config/theme';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logo: string;
  postedAt: string;
  applicants: number;
}

export default function JobsScreen() {
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      logo: '/placeholder.svg?height=48&width=48',
      postedAt: '2 days ago',
      applicants: 45,
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      logo: '/placeholder.svg?height=48&width=48',
      postedAt: '1 week ago',
      applicants: 89,
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'Creative Studio',
      location: 'Remote',
      logo: '/placeholder.svg?height=48&width=48',
      postedAt: '3 days ago',
      applicants: 34,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search jobs"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        {jobs.map(job => (
          <TouchableOpacity key={job.id} style={styles.jobCard}>
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
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent searches</Text>
        <TouchableOpacity style={styles.searchItem}>
          <Search size={20} color={colors.text.secondary} />
          <Text style={styles.searchText}>Software Engineer in San Francisco</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchItem}>
          <Search size={20} color={colors.text.secondary} />
          <Text style={styles.searchText}>Remote Product Manager</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.large,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.medium,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.medium,
    marginLeft: spacing.small,
    fontSize: fontSizes.large,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: spacing.small,
    padding: spacing.large,
  },
  sectionTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: '600',
    marginBottom: spacing.large,
  },
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
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchText: {
    marginLeft: spacing.medium,
    fontSize: fontSizes.medium,
  },
});

