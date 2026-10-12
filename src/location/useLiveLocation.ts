import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPosition } from '../services/location';
import type { GeoFix } from '../types/models';

export type LocationPermission = 'granted' | 'denied' | 'prompt';

export interface LocationValue {
  stored: GeoFix | null;
  permission: LocationPermission;
  error: string;
  refresh: () => Promise<GeoFix>;
}

/*
 * App-wide live location. On mount (the engineer opens the app) it asks for
 * permission once and stores the fix. Screens reuse that fix to prefill, but
 * call `refresh()` at submit time to record a FRESH live fix. Each fix carries
 * a `mocked` flag; the server rejects any location reported as mocked.
 */
export function useLiveLocation(): LocationValue {
  const [stored, setStored] = useState<GeoFix | null>(null);
  const [permission, setPermission] = useState<LocationPermission>('prompt');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const c = await getPosition();
        if (!cancelled) {
          setStored(c);
          setPermission('granted');
          setError('');
        }
      } catch (err) {
        if (cancelled) {
          return;
        }
        const message = err instanceof Error ? err.message : '';
        setPermission(/denied|permission/i.test(message) ? 'denied' : 'prompt');
        setError(message || 'Location unavailable');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    const c = await getPosition();
    setStored(c);
    setPermission('granted');
    setError('');
    return c;
  }, []);

  return useMemo(() => ({ stored, permission, error, refresh }), [stored, permission, error, refresh]);
}
