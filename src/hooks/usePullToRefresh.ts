import { useCallback, useState } from 'react';

/** Pull-to-refresh state around an async loader. */
export function usePullToRefresh(load: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);
  return { refreshing, onRefresh };
}
