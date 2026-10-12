import { deleteSecureItem, getSecureItem, setSecureItem } from '../services/secureStorage';
import { jwtExpiry } from './jwt';

// The JWT lives in the OS secure keystore and is cached in memory so request
// headers can be built synchronously.
const TOKEN_KEY = 'gba_field_token';
let cachedToken: string | null = null;

export async function loadToken(): Promise<string | null> {
  cachedToken = await getSecureItem(TOKEN_KEY);
  return cachedToken;
}

export async function setToken(token: string | null): Promise<void> {
  cachedToken = token || null;
  if (token) {
    await setSecureItem(TOKEN_KEY, token);
  } else {
    await deleteSecureItem(TOKEN_KEY);
  }
}

export function getToken(): string | null {
  return cachedToken;
}

/** Epoch ms at which the cached token expires, or null. */
export function getTokenExpiry(): number | null {
  return jwtExpiry(cachedToken);
}
