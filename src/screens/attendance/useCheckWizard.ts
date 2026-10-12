import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { attendance } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { ACCURACY_HINT_M } from '../../config/constants';
import { getPosition } from '../../services/location';
import type { CheckPayload, GeoFix, Photo, WardBoundary } from '../../types/models';
import { checkResultAlert } from './attendance.utils';
import type { CheckMode } from './useMarkView';

export type WizardStep = 'selfie' | 'map';

// The assigned ward outline rarely changes; fetch it once per app session.
let boundaryCache: WardBoundary | null = null;

// Check-in / check-out: step 1 live selfie, step 2 GPS fix validated against
// the ward boundary (outside the ward requires remarks).
export function useCheckWizard(mode: CheckMode, onDone: () => void) {
  const isCheckIn = mode === 'checkin';
  const [step, setStep] = useState<WizardStep>('selfie');
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [boundary, setBoundary] = useState<WardBoundary | null>(boundaryCache);
  const [coords, setCoords] = useState<GeoFix | null>(null);
  const [inside, setInside] = useState<boolean | null>(null);
  const [remarks, setRemarks] = useState('');
  const [locating, setLocating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const accLimit = boundary?.max_accuracy_m && boundary.max_accuracy_m > 0 ? boundary.max_accuracy_m : ACCURACY_HINT_M;
  const poorAccuracy = coords?.accuracy != null && coords.accuracy > accLimit;
  const mocked = coords?.mocked === true;
  const needRemarks = inside === false;
  const canSubmit =
    !!photo &&
    !!coords &&
    !locating &&
    !busy &&
    !poorAccuracy &&
    !mocked &&
    (inside === true || (needRemarks && !!remarks.trim()));

  const fetchLocation = useCallback(async () => {
    setError('');
    setLocating(true);
    setInside(null);
    try {
      const c = await getPosition();
      setCoords(c);
      try {
        const r = await attendance.validateLocation(c.lat, c.lng);
        setInside(r.inside);
      } catch {
        setInside(null);
      }
    } catch (err) {
      setError(apiError(err, 'Could not fetch your location.'));
    } finally {
      setLocating(false);
    }
  }, []);

  const openMap = useCallback(async () => {
    if (!photo) {
      setError('Please capture a live selfie first.');
      return;
    }
    setError('');
    setStep('map');
    if (!boundaryCache) {
      try {
        boundaryCache = await attendance.myBoundary();
        setBoundary(boundaryCache);
      } catch {}
    }
    fetchLocation();
  }, [photo, fetchLocation]);

  const submit = useCallback(async () => {
    setError('');
    if (!canSubmit || !coords || !photo) {
      return;
    }
    setBusy(true);
    try {
      const payload: CheckPayload = {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: coords.accuracy,
        is_mock: coords.mocked,
        photo,
      };
      if (needRemarks) {
        payload.remarks = remarks.trim();
      }
      const res = isCheckIn ? await attendance.checkIn(payload) : await attendance.checkOut(payload);
      const { title, message } = checkResultAlert(isCheckIn, res);
      Alert.alert(title, message);
      onDone();
    } catch (err) {
      setError(apiError(err, 'Submission failed.'));
    } finally {
      setBusy(false);
    }
  }, [canSubmit, coords, photo, needRemarks, remarks, isCheckIn, onDone]);

  return {
    isCheckIn,
    step,
    photo,
    setPhoto,
    boundary,
    coords,
    inside,
    remarks,
    setRemarks,
    locating,
    busy,
    error,
    accLimit,
    poorAccuracy,
    mocked,
    needRemarks,
    canSubmit,
    openMap,
    fetchLocation,
    submit,
  };
}
