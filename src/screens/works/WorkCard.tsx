import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Work } from '../../types/models';
import { workTrail } from '../../utils/jurisdiction';
import { styles } from './works.styles';
import { hasLocation, isOpenWork, statusBadge } from './works.utils';

export default function WorkCard({ work, onPress }: { work: Work; onPress: () => void }) {
  const isOpen = isOpenWork(work);
  const badge = statusBadge(work.status);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.rowBetween}>
        <Text style={styles.workTitle}>{work.title}</Text>
        <Text style={[styles.badge, { backgroundColor: badge.color }]}>{badge.label}</Text>
      </View>
      <Text style={styles.muted}>{workTrail(work)}</Text>
      {work.is_self_assigned && <Text style={[styles.badge, styles.badgeMuted, styles.badgeBlock]}>Self-assigned</Text>}
      {!isOpen && <Text style={styles.progress}>Progress: {work.physical_progress}%</Text>}
      <View style={styles.cardFooter}>
        {hasLocation(work) && <Text style={styles.locHint}>📍 Location on map</Text>}
        <Text style={styles.tapHint}>{isOpen ? 'Tap to view & take up →' : 'Tap for details →'}</Text>
      </View>
    </TouchableOpacity>
  );
}
