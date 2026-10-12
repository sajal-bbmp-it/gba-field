import React from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import KeyboardAwareScroll from '../../components/KeyboardAwareScroll';
import Loading from '../../components/Loading';
import { styles } from './activities.styles';
import NewActivity from './NewActivity';
import { useActivitiesScreen } from './useActivitiesScreen';

export default function ActivitiesScreen() {
  const { items, loading, error, refreshing, onRefresh, creating, startCreate, cancelCreate, onSaved } =
    useActivitiesScreen();

  if (loading) {
    return <Loading label="Loading activities…" />;
  }
  if (creating) {
    return <NewActivity onCancel={cancelCreate} onSaved={onSaved} />;
  }

  return (
    <KeyboardAwareScroll refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <TouchableOpacity style={styles.btn} onPress={startCreate}>
        <Text style={styles.btnText}>＋ Log Activity</Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {items.length === 0 ? (
        <Text style={styles.empty}>No activities logged yet.</Text>
      ) : (
        items.map(a => (
          <View key={a.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.cat}>{a.category}</Text>
              <Text style={styles.muted}>{a.timeLabel}</Text>
            </View>
            <Text style={styles.desc}>{a.description}</Text>
            {!!a.location && <Text style={styles.muted}>📍 {a.location}</Text>}
          </View>
        ))
      )}
    </KeyboardAwareScroll>
  );
}
