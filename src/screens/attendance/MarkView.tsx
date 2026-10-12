import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import { styles } from './attendance.styles';
import { checkedInText, completedText } from './attendance.utils';
import CheckWizard from './CheckWizard';
import { useMarkView } from './useMarkView';

// Today's attendance: check in, check out, or the completed summary.
export default function MarkView() {
  const {
    today, rec, loading, error, mode, checkedIn, checkedOut,
    startCheckIn, startCheckOut, closeWizard, onWizardDone,
  } = useMarkView();

  if (loading) {
    return <Loading label="Loading attendance…" />;
  }
  if (mode) {
    return <CheckWizard mode={mode} onCancel={closeWizard} onDone={onWizardDone} />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <ErrorMessage message={error} />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today — {today}</Text>
        {!rec || !checkedIn ? (
          <>
            <Text style={styles.muted}>You have not checked in. A live selfie and your location are required.</Text>
            <TouchableOpacity style={styles.btn} onPress={startCheckIn}>
              <Text style={styles.btnText}>📷 Check In</Text>
            </TouchableOpacity>
          </>
        ) : !checkedOut ? (
          <>
            <Text style={styles.status}>{checkedInText(rec)}</Text>
            <TouchableOpacity style={[styles.btn, styles.btnLight]} onPress={startCheckOut}>
              <Text style={styles.btnText}>📷 Check Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.status}>{completedText(rec)}</Text>
            <Text style={[styles.pill, rec.status === 'alert' ? styles.pillAlert : styles.pillOk]}>
              {rec.status === 'alert' ? '⚠ Alert' : '✔ Success'}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}
