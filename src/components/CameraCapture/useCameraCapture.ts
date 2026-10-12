import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { capturePhoto, CameraPermissionError, type CameraFacing } from '../../services/camera';
import type { Photo } from '../../types/models';

export function useCameraCapture(onCapture: (photo: Photo | null) => void, facing: CameraFacing) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);

  const snap = useCallback(async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      const pic = await capturePhoto(facing);
      if (pic) {
        setPhoto(pic);
        onCapture(pic);
      }
    } catch (e) {
      if (e instanceof CameraPermissionError) {
        Alert.alert('Camera permission needed', 'Allow camera access to capture a live photo.');
      } else {
        Alert.alert('Camera error', 'Could not capture a photo. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }, [busy, facing, onCapture]);

  const retake = useCallback(() => {
    setPhoto(null);
    onCapture(null);
  }, [onCapture]);

  return { photo, busy, snap, retake };
}
