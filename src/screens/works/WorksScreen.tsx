import React from 'react';
import { RefreshControl, Text, TouchableOpacity } from 'react-native';
import ErrorMessage from '../../components/ErrorMessage';
import KeyboardAwareScroll from '../../components/KeyboardAwareScroll';
import Loading from '../../components/Loading';
import NewWork from './NewWork';
import { useWorksScreen } from './useWorksScreen';
import WorkCard from './WorkCard';
import WorkDetail from './WorkDetail';
import { styles } from './works.styles';

export default function WorksScreen() {
  const {
    list, loading, error, refreshing, onRefresh, selected, creating, selectedCategory,
    startCreate, select, cancel, saved,
  } = useWorksScreen();

  if (loading) {
    return <Loading label="Loading works…" />;
  }
  if (creating) {
    return <NewWork onCancel={cancel} onSaved={saved} />;
  }
  if (selected) {
    return <WorkDetail work={selected} catName={selectedCategory} onBack={cancel} onChanged={saved} />;
  }

  return (
    <KeyboardAwareScroll refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <TouchableOpacity style={styles.btn} onPress={startCreate}>
        <Text style={styles.btnText}>＋ New Work</Text>
      </TouchableOpacity>
      <ErrorMessage message={error} style={styles.errorSpacing} />
      {list.length === 0 ? (
        <Text style={styles.empty}>No works assigned to you yet.</Text>
      ) : (
        list.map(w => <WorkCard key={w.id} work={w} onPress={() => select(w)} />)
      )}
    </KeyboardAwareScroll>
  );
}
