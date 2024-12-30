import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { colors, fontSizes, spacing } from '../../config/theme';
import { ConnectionCard } from '@/components/connection-card';

interface Connection {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  mutualConnections: number;
}

export default function NetworkScreen() {
  const connections: Connection[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      headline: 'Full Stack Developer at Tech Solutions',
      avatar: '/placeholder.svg?height=80&width=80',
      mutualConnections: 12,
    },
    {
      id: '2',
      name: 'Maria Garcia',
      headline: 'Product Manager at Innovation Labs',
      avatar: '/placeholder.svg?height=80&width=80',
      mutualConnections: 8,
    },
    {
      id: '3',
      name: 'James Wilson',
      headline: 'UX Designer at Creative Studio',
      avatar: '/placeholder.svg?height=80&width=80',
      mutualConnections: 15,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage my network</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your network stats</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>412</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>28</Text>
            <Text style={styles.statLabel}>Invitations</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>People you may know</Text>
        {connections.map(connection => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.large,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSizes.xxlarge,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: colors.white,
    marginTop: spacing.small,
    padding: spacing.large,
  },
  statsTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: '600',
    marginBottom: spacing.medium,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSizes.xxlarge,
    fontWeight: '600',
    color: colors.primary,
  },
  statLabel: {
    color: colors.text.secondary,
    marginTop: spacing.small,
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
});

