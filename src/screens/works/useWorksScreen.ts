import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { workCategories, works } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import type { Work } from '../../types/models';

export function useWorksScreen() {
  const [list, setList] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Work | null>(null);
  const [creating, setCreating] = useState(false);
  const [catMap, setCatMap] = useState<Record<number, string>>({});

  const load = useCallback(async () => {
    setError('');
    try {
      setList(await works.mine());
    } catch (err) {
      setError(apiError(err, 'Could not load works.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    workCategories
      .list()
      .then(rows => setCatMap(Object.fromEntries(rows.map(c => [c.id, c.name]))))
      .catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );
  const { refreshing, onRefresh } = usePullToRefresh(load);

  // Leave the sub-view and reload the list.
  const backToList = useCallback(
    (reload: boolean) => {
      setCreating(false);
      setSelected(null);
      if (reload) {
        load();
      }
    },
    [load],
  );

  return {
    list,
    loading,
    error,
    refreshing,
    onRefresh,
    selected,
    creating,
    selectedCategory: selected?.category_id != null ? catMap[selected.category_id] : undefined,
    startCreate: () => setCreating(true),
    select: setSelected,
    cancel: () => backToList(false),
    saved: () => backToList(true),
  };
}
