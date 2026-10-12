import { deleteSecureItem, getSecureItem, setSecureItem } from '../services/secureStorage';
import type { User } from '../types/models';

// The signed-in user (from verify-otp) is persisted next to the token so a
// cold start restores the session.
const USER_KEY = 'gba_field_user';

export async function loadStoredUser(): Promise<User | null> {
  const raw = await getSecureItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function saveStoredUser(user: User): Promise<void> {
  try {
    await setSecureItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Non-fatal: the session just won't survive a restart.
  }
}

export async function clearStoredUser(): Promise<void> {
  try {
    await deleteSecureItem(USER_KEY);
  } catch {}
}
