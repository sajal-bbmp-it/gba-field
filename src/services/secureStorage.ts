import * as Keychain from 'react-native-keychain';

// Small key/value wrapper over the OS secure keystore (iOS Keychain / Android
// Keystore). Each key is stored as its own keychain "service".

export async function getSecureItem(key: string): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: key });
  return creds ? creds.password : null;
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  await Keychain.setGenericPassword(key, value, { service: key });
}

export async function deleteSecureItem(key: string): Promise<void> {
  await Keychain.resetGenericPassword({ service: key });
}
