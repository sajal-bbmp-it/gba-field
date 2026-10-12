import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { activities } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import type { Activity } from '../../types/models';
import { fmtDateTime } from '../../utils/date';

export function useActivitiesScreen() {
  const [list, setList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setList(await activities.mine());
    } catch (err) {
      setError(apiError(err, 'Could not load activities.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );
  const { refreshing, onRefresh } = usePullToRefresh(load);

  return {
    items: list.map(a => ({ ...a, timeLabel: fmtDateTime(a.activity_time) })),
    loading,
    error,
    refreshing,
    onRefresh,
    creating,
    startCreate: () => setCreating(true),
    cancelCreate: () => setCreating(false),
    onSaved: () => {
      setCreating(false);
      load();
    },
  };
}
