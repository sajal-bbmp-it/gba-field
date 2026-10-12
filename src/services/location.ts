import Geolocation, { type GeolocationResponse } from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import type { GeoFix } from '../types/models';

// Native high-accuracy GPS. Resolves to { lat, lng, accuracy, mocked } or throws.
//
// `mocked` (Android) is true when the fix came from a mock-location provider —
// i.e. a fake-GPS app enabled through developer settings. The server rejects
// spoofed locations. iOS has no such API, so it is always false there.

export const PERMISSION_DENIED_MESSAGE =
  'Location permission denied. Enable it in Settings to continue.';

let configured = false;
function configure() {
  if (configured) {
    return;
  }
  Geolocation.setRNConfiguration({
    skipPermissionRequests: true, // we ask explicitly below
    authorizationLevel: 'whenInUse',
    locationProvider: 'auto',
  });
  configured = true;
}

export async function requestLocationPermission(): Promise<boolean> {
  configure();
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Location permission',
      message: 'Allow GBA Field to use your location to verify attendance within your ward.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    });
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return new Promise(resolve => {
    Geolocation.requestAuthorization(
      () => resolve(true),
      () => resolve(false),
    );
  });
}

function errorMessage(code: number, fallback: string): string {
  switch (code) {
    case 1:
      return PERMISSION_DENIED_MESSAGE;
    case 2:
      return 'Location unavailable. Turn on GPS / location services and try again.';
    case 3:
      return 'Timed out fetching your location. Move to an open area and try again.';
    default:
      return fallback || 'Could not fetch your location.';
  }
}

export async function getPosition(): Promise<GeoFix> {
  if (!(await requestLocationPermission())) {
    throw new Error(PERMISSION_DENIED_MESSAGE);
  }
  const pos = await new Promise<GeolocationResponse & { mocked?: boolean }>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      resolve,
      err => reject(new Error(errorMessage(err.code, err.message))),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  });
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    mocked: pos.mocked === true,
  };
}
