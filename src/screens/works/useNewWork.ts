import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { attachments, workCategories, works } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { useAuth } from '../../auth/AuthContext';
import { useCapturedLocation } from '../../hooks/useCapturedLocation';
import type { Photo, WorkCategory } from '../../types/models';
import { placeTrail } from '../../utils/jurisdiction';
import { buildCreateBody, categoryOptions, photoMeta, validateNewWork } from './works.utils';

const MOCK_ERROR = 'A fake / mock GPS location was detected. Disable it and try again.';

export function useNewWork(onSaved: () => void) {
  const { user } = useAuth();
  const [cats, setCats] = useState<WorkCategory[]>([]);
  const [catsError, setCatsError] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const loc = useCapturedLocation(setError, 'Could not capture location.');

  useEffect(() => {
    (async () => {
      try {
        const rows = await workCategories.list();
        setCats(rows);
        if (rows.length) {
          setCategoryId(rows[0].id);
        }
      } catch (err) {
        setCatsError(apiError(err, 'Could not load work categories.'));
      }
    })();
  }, []);

  const submit = useCallback(async () => {
    setError('');
    const invalid = validateNewWork({
      title,
      categoryId,
      coords: loc.coords,
      photo,
      mocked: loc.mocked,
      inside: loc.inside,
      remarks,
    });
    if (invalid || !user || !photo || !categoryId) {
      setError(invalid || 'Please complete the form.');
      return;
    }
    setBusy(true);
    try {
      const fix = await loc.freshFix();
      if (fix.mocked) {
        setError(MOCK_ERROR);
        return;
      }
      const created = await works.create(buildCreateBody(user, { title, categoryId, description, remarks }, fix));
      // The live site photo is the "before" photo (server geo-tags + watermarks it).
      await attachments.upload('work', created.id, photo, photoMeta(fix, 'before'));
      Alert.alert('Created', 'Work added.');
      onSaved();
    } catch (err) {
      setError(apiError(err, 'Could not create the work.'));
    } finally {
      setBusy(false);
    }
  }, [title, categoryId, description, remarks, photo, user, loc, onSaved]);

  return {
    error,
    catsError,
    categoryChoices: categoryOptions(cats),
    categoryId,
    setCategoryId,
    title,
    setTitle,
    description,
    setDescription,
    remarks,
    setRemarks,
    setPhoto,
    coords: loc.coords,
    locating: loc.locating,
    grab: loc.grab,
    place: loc.place,
    placeTrail: loc.place ? placeTrail(loc.place) : '',
    inside: loc.inside,
    mocked: loc.mocked,
    busy,
    submit,
  };
}
