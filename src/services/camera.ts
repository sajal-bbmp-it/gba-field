import { PermissionsAndroid, Platform } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import type { Photo } from '../types/models';

export type CameraFacing = 'front' | 'back';

/** Thrown when the user has not granted camera access. */
export class CameraPermissionError extends Error {
  constructor() {
    super('Camera permission denied');
    this.name = 'CameraPermissionError';
  }
}

async function ensureCameraPermission(): Promise<void> {
  // iOS: the picker prompts on its own (NSCameraUsageDescription).
  if (Platform.OS !== 'android') {
    return;
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
    title: 'Camera permission',
    message: 'Allow GBA Field to use the camera for attendance selfies and activity photos.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });
  if (result !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new CameraPermissionError();
  }
}

// Opens the phone's native camera app and returns the live photo, or null if
// the user cancelled. Gallery is intentionally not offered (field evidence).
export async function capturePhoto(facing: CameraFacing = 'back'): Promise<Photo | null> {
  await ensureCameraPermission();
  const res = await launchCamera({
    mediaType: 'photo',
    cameraType: facing,
    quality: 0.6,
    saveToPhotos: false,
  });
  if (res.didCancel) {
    return null;
  }
  if (res.errorCode === 'permission') {
    throw new CameraPermissionError();
  }
  if (res.errorCode) {
    throw new Error(res.errorMessage || res.errorCode);
  }
  const asset = res.assets?.[0];
  if (!asset?.uri) {
    return null;
  }
  return {
    uri: asset.uri,
    name: asset.fileName || 'photo.jpg',
    type: asset.type || 'image/jpeg',
  };
}
