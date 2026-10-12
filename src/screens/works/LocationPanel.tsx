import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import WardMapWebView from '../../components/WardMapWebView';
import type { Work } from '../../types/models';
import { formatCoords } from '../../utils/validation';
import { styles } from './works.styles';
import { hasLocation } from './works.utils';

// Mini-map at the work's point, its coordinates, and a tap-through to directions.
export default function LocationPanel({ work, onDirections }: { work: Work; onDirections: () => void }) {
  if (!hasLocation(work)) {
    return <Text style={styles.muted}>No map location set for this work.</Text>;
  }
  return (
    <View>
      <WardMapWebView position={{ lat: work.lat, lng: work.lng }} inside />
      <TouchableOpacity style={styles.dirRow} onPress={onDirections}>
        <Text style={styles.dirCoords}>📍 {formatCoords(work.lat, work.lng, 6)}</Text>
        <Text style={styles.dirLink}>🧭 Get directions</Text>
      </TouchableOpacity>
    </View>
  );
}
