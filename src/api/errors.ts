export const NETWORK_ERROR = 'Network Error';
export const TIMEOUT_ERROR = 'Request timed out';

/** Thrown by the API client. `status` is null when no response arrived. */
export class ApiError extends Error {
  status: number | null;
  data: unknown;

  constructor(message: string, status: number | null = null, data: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type FastApiDetail = string | Array<{ msg?: string }> | undefined;

// Turn a FastAPI (or any) error into a readable string.
export function apiError(err: unknown, fallback = 'Something went wrong'): string {
  if (err instanceof ApiError) {
    const detail = (err.data as { detail?: FastApiDetail } | null)?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail.map(e => e.msg || JSON.stringify(e)).join('; ');
    }
    if (err.message === NETWORK_ERROR) {
      return 'Cannot reach the server. Check your internet connection and the API_BASE_URL in your .env file.';
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
