import { useCallback, useEffect, useState } from 'react';
import { jurisdiction } from '../api/endpoints';
import { apiError } from '../api/errors';
import { useLocation } from '../location/LocationContext';
import type { GeoFix, ResolvedPoint } from '../types/models';

// A captured GPS point for a form, reverse-geocoded to its ward and checked
// against the engineer's own jurisdiction. Prefills from the fix taken when the
// app opened; `grab()` fetches a fresh one. `freshFix()` is for submit time.
export function useCapturedLocation(onError: (message: string) => void, failMessage: string) {
  const { stored, refresh } = useLocation();
  const [coords, setCoords] = useState<GeoFix | null>(null);
  const [place, setPlace] = useState<ResolvedPoint | null>(null);
  const [inside, setInside] = useState<boolean | null>(null);
  const [locating, setLocating] = useState(false);
  const mocked = coords?.mocked === true;

  const resolveFor = useCallback(async (c: GeoFix) => {
    setCoords(c);
    try {
      const res = await jurisdiction.resolvePoint(c.lat, c.lng);
      setPlace(res);
      setInside(res.inside_jurisdiction);
    } catch {
      setPlace(null);
      setInside(null);
    }
  }, []);

  useEffect(() => {
    if (stored && !coords) {
      resolveFor(stored);
    }
    // Only prefill once, when the app-level fix first arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored]);

  const grab = useCallback(async () => {
    setLocating(true);
    onError('');
    setPlace(null);
    setInside(null);
    try {
      await resolveFor(await refresh());
    } catch (err) {
      onError(apiError(err, failMessage));
    } finally {
      setLocating(false);
    }
  }, [onError, failMessage, refresh, resolveFor]);

  // Record a fresh live fix at submit so the saved location is current; keep
  // the last captured coords if the refresh fails.
  const freshFix = useCallback(async (): Promise<GeoFix> => {
    try {
      return await refresh();
    } catch {
      return coords as GeoFix;
    }
  }, [coords, refresh]);

  return { coords, place, inside, locating, mocked, grab, freshFix };
}
