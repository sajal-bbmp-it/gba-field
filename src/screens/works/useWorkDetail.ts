import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { attachments, workCategories, works } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { useAuth } from '../../auth/AuthContext';
import { WORK_PROGRESS_STATUSES } from '../../config/constants';
import { useLocation } from '../../location/LocationContext';
import { openDirections } from '../../services/maps';
import type { GeoFix, Photo, Work, WorkAttachment, WorkCategory } from '../../types/models';
import { workTrail } from '../../utils/jurisdiction';
import { clampPercent, digitsOnly } from '../../utils/validation';
import {
  authImageSource,
  buildUpdateBody,
  categoryOptions,
  initialProgressStatus,
  phaseLabel,
  photoMeta,
  statusBadge,
  workAccess,
} from './works.utils';

export function useWorkDetail(work: Work, onChanged: () => void) {
  const { refresh } = useLocation();
  const { user } = useAuth();
  const access = workAccess(work, user);

  const [progress, setProgressText] = useState(String(work.physical_progress));
  const [status, setStatus] = useState(initialProgressStatus(work));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [remarks, setRemarks] = useState('');
  const [photos, setPhotos] = useState<WorkAttachment[]>([]);

  const [editing, setEditing] = useState(false);
  const [eTitle, setETitle] = useState(work.title);
  const [eCat, setECat] = useState<number | null>(work.category_id);
  const [eDesc, setEDesc] = useState(work.description || '');
  const [eCats, setECats] = useState<WorkCategory[]>([]);

  useEffect(() => {
    works
      .attachments(work.id)
      .then(setPhotos)
      .catch(() => setPhotos([]));
  }, [work.id, work.status]);

  const startEdit = useCallback(async () => {
    setError('');
    try {
      setECats(await workCategories.list());
    } catch {
      // chips just won't show
    }
    setETitle(work.title);
    setECat(work.category_id);
    setEDesc(work.description || '');
    setEditing(true);
  }, [work]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setError('');
  }, []);

  const saveEdit = useCallback(async () => {
    if (!eTitle.trim()) {
      setError('Title is required.');
      return;
    }
    if (!eCat) {
      setError('Please pick a category.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await works.update(work.id, buildUpdateBody(work, { title: eTitle, categoryId: eCat, description: eDesc }));
      Alert.alert('Saved', 'Work details updated.');
      onChanged();
    } catch (err) {
      setError(apiError(err, 'Could not update the work.'));
    } finally {
      setBusy(false);
    }
  }, [work, eTitle, eCat, eDesc, onChanged]);

  const claim = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      await works.claim(work.id);
      Alert.alert('Taken up', 'This work is now assigned to you.');
      onChanged();
    } catch (err) {
      setError(apiError(err, 'Could not take up this work.'));
      setBusy(false);
    }
  }, [work.id, onChanged]);

  const saveProgress = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      await works.updateProgress(work.id, { physical_progress: clampPercent(progress), status });
      Alert.alert('Saved', 'Progress updated.');
      onChanged();
    } catch (err) {
      setError(apiError(err, 'Could not update progress.'));
    } finally {
      setBusy(false);
    }
  }, [work.id, progress, status, onChanged]);

  const closeWork = useCallback(async () => {
    if (!photo) {
      setError('A completion photo is required to close the work.');
      return;
    }
    if (!remarks.trim()) {
      setError('Closure remarks are required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      let fix: GeoFix | null = null;
      try {
        fix = await refresh();
      } catch {}
      if (fix?.mocked) {
        setError('A fake / mock GPS location was detected. Disable it and try again.');
        return;
      }
      // Backend requires a photo before closing: the "after" completion evidence.
      await attachments.upload('work', work.id, photo, photoMeta(fix, 'after'));
      await works.close(work.id, remarks.trim());
      Alert.alert('Closed', 'Work marked complete.');
      onChanged();
    } catch (err) {
      setError(apiError(err, 'Could not close the work.'));
    } finally {
      setBusy(false);
    }
  }, [work.id, photo, remarks, refresh, onChanged]);

  return {
    ...access,
    badge: statusBadge(work.status),
    trail: workTrail(work),
    busy,
    error,
    // edit
    editing,
    startEdit,
    cancelEdit,
    saveEdit,
    eTitle,
    setETitle,
    eCat,
    setECat,
    eDesc,
    setEDesc,
    editCategoryChoices: categoryOptions(eCats),
    // photos
    photos: photos.map(p => ({ id: p.id, source: authImageSource(p.file_url), caption: phaseLabel(p.phase) })),
    // claim / progress
    claim,
    progress,
    onProgressChange: (t: string) => setProgressText(digitsOnly(t)),
    status,
    setStatus,
    statusChoices: WORK_PROGRESS_STATUSES,
    saveProgress,
    assigneeText: `Taken up by ${work.assignee_name || 'another engineer'}${
      work.assignee_role ? ` (${work.assignee_role.toUpperCase()})` : ''
    }.`,
    // close
    closing,
    startClosing: () => setClosing(true),
    cancelClosing: () => setClosing(false),
    setPhoto,
    remarks,
    setRemarks,
    closeWork,
    // location
    openDirections: () => {
      if (work.lat != null && work.lng != null) {
        openDirections(work.lat, work.lng);
      }
    },
  };
}
