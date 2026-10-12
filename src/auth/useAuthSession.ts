import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { registerUnauthorizedHandler } from '../api/client';
import { getTokenExpiry, loadToken, setToken } from '../api/tokenStore';
import type { User } from '../types/models';
import { clearStoredUser, loadStoredUser, saveStoredUser } from './userStore';

export interface AuthValue {
  user: User | null;
  ready: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

// Holds the logged-in user + token lifecycle: restore on cold start, auto-logout
// when the JWT expires, and logout on any 401.
export function useAuthSession(): AuthValue {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const expiryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearExpiryTimer = useCallback(() => {
    if (expiryTimer.current) {
      clearTimeout(expiryTimer.current);
      expiryTimer.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    clearExpiryTimer();
    try {
      await setToken(null);
    } catch {}
    await clearStoredUser();
    setUser(null);
  }, [clearExpiryTimer]);

  // Auto-logout the instant the JWT expires, even if the app is idle. Logs out
  // immediately if the token is already past expiry.
  const scheduleExpiry = useCallback(() => {
    clearExpiryTimer();
    const expiresAt = getTokenExpiry();
    if (!expiresAt) {
      return;
    }
    const ms = expiresAt - Date.now();
    if (ms <= 0) {
      logout();
      return;
    }
    expiryTimer.current = setTimeout(() => {
      logout();
    }, ms);
  }, [clearExpiryTimer, logout]);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();
    });
    (async () => {
      try {
        const token = await loadToken();
        const stored = await loadStoredUser();
        if (token && stored) {
          setUser(stored);
          scheduleExpiry();
        }
      } catch {
        // corrupt/missing — start logged out
      } finally {
        setReady(true);
      }
    })();
    // Background timers get throttled/paused by the OS, so re-check the moment
    // the app returns to the foreground.
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        scheduleExpiry();
      }
    });
    return () => {
      clearExpiryTimer();
      registerUnauthorizedHandler(null);
      sub.remove();
    };
  }, [clearExpiryTimer, logout, scheduleExpiry]);

  const login = useCallback(
    async (token: string, userObj: User) => {
      await setToken(token);
      await saveStoredUser(userObj);
      setUser(userObj);
      scheduleExpiry();
    },
    [scheduleExpiry],
  );

  return useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
}
