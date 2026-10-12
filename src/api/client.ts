import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env';
import { ApiError, NETWORK_ERROR, TIMEOUT_ERROR } from './errors';
import { getToken } from './tokenStore';

// fetch-based HTTP client: base URL, bearer token, timeout, JSON / multipart
// bodies, and a global 401 hook (AuthContext logs the user out through it).

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
type Params = Record<string, string | number | boolean | null | undefined>;

interface RequestOptions {
  params?: Params;
  body?: unknown;
}

let onUnauthorized: (() => void) | null = null;
export function registerUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

function buildUrl(path: string, params?: Params): string {
  const query = Object.entries(params ?? {})
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `${API_BASE_URL}${path}${query ? `?${query}` : ''}`;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(method: Method, path: string, { params, body }: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, params);
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // For FormData, fetch sets the multipart Content-Type (with boundary) itself.
  let payload: FormData | string | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (__DEV__) {
    console.log('[API] →', method, url, body instanceof FormData ? '(multipart)' : body ?? '');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { method, headers, body: payload, signal: controller.signal });
  } catch (err) {
    const message = controller.signal.aborted ? TIMEOUT_ERROR : NETWORK_ERROR;
    if (__DEV__) {
      console.log('[API] ✕', url, 'NO RESPONSE', message, err);
    }
    throw new ApiError(message);
  } finally {
    clearTimeout(timer);
  }

  const data = await parseBody(res);
  if (!res.ok) {
    if (__DEV__) {
      console.log('[API] ✕', url, res.status, data ?? '');
    }
    // The token is invalid/expired — clear it and log the user out.
    if (res.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    throw new ApiError(`Request failed with status code ${res.status}`, res.status, data);
  }

  if (__DEV__) {
    console.log('[API] ←', res.status, path, data);
  }
  return data as T;
}

export const http = {
  get: <T>(path: string, params?: Params) => request<T>('GET', path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
};
