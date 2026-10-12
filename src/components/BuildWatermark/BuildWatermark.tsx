import React from 'react';
import { Text, View } from 'react-native';
import { getBuildBadge } from './buildBadge';
import { styles } from './styles';

const badge = getBuildBadge();

// A small pill for the screen header showing the build environment, so a
// tester can tell a LOCAL/TEST build apart. Renders nothing on prod.
export default function BuildWatermark() {
  if (!badge) {
    return null;
  }
  return (
    <View pointerEvents="none" style={[styles.pill, { backgroundColor: badge.color }]}>
      <Text style={styles.label}>{badge.label}</Text>
    </View>
  );
}
