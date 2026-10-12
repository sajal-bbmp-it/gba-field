import { Alert, Linking } from 'react-native';

// Open the device maps app with driving directions to a point.
export function openDirections(lat: number, lng: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  Linking.openURL(url).catch(() => Alert.alert('Could not open maps', 'No maps app is available.'));
}
