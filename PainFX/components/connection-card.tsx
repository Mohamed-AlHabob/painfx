import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { colors, fontSizes, spacing, borderRadius } from '../config/theme';

interface ConnectionCardProps {
  connection: {
    id: string;
    name: string;
    headline: string;
    avatar: string;
    mutualConnections: number;
  };
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  return (
    <View style={styles.connectionCard}>
      <Image 
        source={{ uri: connection.avatar }} 
        style={styles.connectionAvatar}
      />
      <View style={styles.connectionInfo}>
        <Text style={styles.connectionName}>{connection.name}</Text>
        <Text style={styles.connectionHeadline}>{connection.headline}</Text>
        <Text style={styles.mutualConnections}>
          {connection.mutualConnections} mutual connections
        </Text>
      </View>
      <TouchableOpacity style={styles.connectButton}>
        <UserPlus size={20} color={colors.primary} />
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  connectionAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
  },
  connectionInfo: {
    flex: 1,
    marginLeft: spacing.medium,
  },
  connectionName: {
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  connectionHeadline: {
    color: colors.text.secondary,
    fontSize: fontSizes.medium,
    marginTop: spacing.small / 2,
  },
  mutualConnections: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
    marginTop: spacing.small / 2,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  connectButtonText: {
    color: colors.primary,
    marginLeft: spacing.small / 2,
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
});

