import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Dropdown from '../../components/Dropdown';
import Loading from '../../components/Loading';
import { styles } from './attendance.styles';
import DayCard from './DayCard';
import { useLogView } from './useLogView';

// Monthly attendance history with summary tiles.
export default function LogView() {
  const { monthLabel, yearLabel, monthChoices, yearChoices, setMonth, setYear, totals, days, loading, error } =
    useLogView();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.logTitle}>Log Entries</Text>

      <View style={styles.pickers}>
        <Dropdown label="Month" value={monthLabel} options={monthChoices} onSelect={setMonth} />
        <Dropdown label="Year" value={yearLabel} options={yearChoices} onSelect={setYear} />
      </View>

      <View style={styles.tiles}>
        <View style={[styles.tile, styles.tileMain]}>
          <Text style={styles.tileMainNum}>{totals.working}</Text>
          <Text style={styles.tileMainLabel}>Working Days</Text>
        </View>
        <View style={styles.tile}>
          <Text style={[styles.tileNum, styles.okText]}>{totals.success}</Text>
          <Text style={styles.tileLabel}>Success</Text>
        </View>
        <View style={styles.tile}>
          <Text style={[styles.tileNum, styles.dangerText]}>{totals.absent}</Text>
          <Text style={styles.tileLabel}>Absent</Text>
        </View>
        <View style={styles.tile}>
          <Text style={[styles.tileNum, styles.warnText]}>{totals.alert}</Text>
          <Text style={styles.tileLabel}>Alert</Text>
        </View>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
      {loading ? (
        <Loading label="Loading log…" />
      ) : days.length === 0 ? (
        <Text style={styles.muted}>No entries for this month yet.</Text>
      ) : (
        days.map(d => <DayCard key={d.date} day={d} />)
      )}
    </ScrollView>
  );
}
