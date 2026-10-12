import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { activities, attachments } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { ACTIVITY_CATEGORIES } from '../../config/constants';
import { useCapturedLocation } from '../../hooks/useCapturedLocation';
import type { Photo } from '../../types/models';
import { placeTrail } from '../../utils/jurisdiction';
import { activityCategoryOptions, buildActivityBody, validateNewActivity } from './activities.utils';

export function useNewActivity(onSaved: () => void) {
  const [category, setCategory] = useState(ACTIVITY_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const loc = useCapturedLocation(setError, 'Could not fetch location.');

  const submit = useCallback(async () => {
    setError('');
    const invalid = validateNewActivity({
      description,
      photo,
      coords: loc.coords,
      mocked: loc.mocked,
      inside: loc.inside,
      remarks,
    });
    if (invalid || !photo) {
      setError(invalid || 'Please complete the form.');
      return;
    }
    setBusy(true);
    try {
      const fix = await loc.freshFix();
      if (fix.mocked) {
        setError('A fake / mock GPS location was detected. Disable it and try again.');
        return;
      }
      const created = await activities.create(buildActivityBody({ category, description, location, remarks }, fix));
      await attachments.upload('activity', created.id, photo, {
        lat: fix.lat,
        lng: fix.lng,
        accuracy: fix.accuracy,
        taken_at: new Date().toISOString(),
        is_mock: fix.mocked,
      });
      Alert.alert('Saved', 'Activity logged.');
      onSaved();
    } catch (err) {
      setError(apiError(err, 'Could not log activity.'));
    } finally {
      setBusy(false);
    }
  }, [category, description, location, remarks, photo, loc, onSaved]);

  return {
    error,
    categoryChoices: activityCategoryOptions,
    category,
    setCategory,
    description,
    setDescription,
    location,
    setLocation,
    remarks,
    setRemarks,
    setPhoto,
    coords: loc.coords,
    locating: loc.locating,
    grab: loc.grab,
    place: loc.place,
    placeTrail: loc.place ? placeTrail(loc.place) || '—' : '',
    inside: loc.inside,
    mocked: loc.mocked,
    busy,
    submit,
  };
}
