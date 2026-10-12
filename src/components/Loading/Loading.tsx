import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../../theme';
import { styles } from './styles';

export default function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.brand} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}
