import React from 'react';
import { Text, View } from 'react-native';
import type { AttendanceDay } from '../../types/models';
import { styles } from './attendance.styles';
import { dayView } from './attendance.utils';

export default function DayCard({ day }: { day: AttendanceDay }) {
  const v = dayView(day);
  return (
    <View style={styles.dayCard}>
      <View style={styles.dayLeft}>
        <Text style={styles.dayDate}>{v.dateLabel}</Text>
        <Text style={[styles.dayPlace, { color: v.placeColor }]}>{v.placeLabel}</Text>
      </View>

      <View style={styles.dayTimes}>
        <View style={styles.timeBox}>
          <Text style={styles.timeVal}>{v.inTime}</Text>
          <Text style={[styles.timeTag, v.late && styles.timeTagLate]}>In Time</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.timeVal}>{v.outTime}</Text>
          <Text style={[styles.timeTag, v.early && styles.timeTagLate]}>Out Time</Text>
        </View>
      </View>

      <View style={styles.dayStatus}>
        <Text style={[styles.statusLabel, { color: v.statusColor }]}>{v.statusLabel}</Text>
        {v.hours != null && <Text style={styles.hoursText}>{v.hours}</Text>}
      </View>
    </View>
  );
}
