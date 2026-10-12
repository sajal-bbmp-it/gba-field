import type {
  Activity,
  AttachmentMeta,
  AttendanceRecord,
  AttendanceSummary,
  CheckPayload,
  Id,
  LocationCheck,
  LoginResponse,
  OtpRequestResponse,
  Photo,
  ResolvedPoint,
  WardBoundary,
  Work,
  WorkAttachment,
  WorkCategory,
} from '../types/models';
import { http } from './client';
import { photoForm } from './formData';

// Thin wrappers over the field-engineer subset of the FastAPI backend.

// ---------------- Auth ----------------
export const auth = {
  requestOtp: (mobile: string) => http.post<OtpRequestResponse>('/auth/request-otp', { mobile }),
  verifyOtp: (mobile: string, otp: string) => http.post<LoginResponse>('/auth/verify-otp', { mobile, otp }),
};

// ---------------- Attendance ----------------
function checkForm({ photo, ...fields }: CheckPayload) {
  return photoForm(fields, photo);
}

export const attendance = {
  validateLocation: (lat: number, lng: number) =>
    http.post<LocationCheck>('/attendance/validate-location', { lat, lng }),
  myBoundary: () => http.get<WardBoundary>('/attendance/my-boundary'),
  mine: () => http.get<AttendanceRecord[]>('/attendance/me'),
  // Full month log (day-by-day status + summary counts).
  summary: (year: number, month: number) =>
    http.get<AttendanceSummary>('/attendance/summary', { year, month }),
  checkIn: (payload: CheckPayload) => http.post<AttendanceRecord>('/attendance/check-in', checkForm(payload)),
  checkOut: (payload: CheckPayload) => http.post<AttendanceRecord>('/attendance/check-out', checkForm(payload)),
};

// ---------------- Works ----------------
export const works = {
  mine: () => http.get<Work[]>('/works'),
  create: (body: Record<string, unknown>) => http.post<Work>('/works', body),
  // Edit a self-created work's details (title/category/description).
  update: (id: Id, body: Record<string, unknown>) => http.patch<Work>(`/works/${id}`, body),
  updateProgress: (id: Id, body: { physical_progress: number; status: string }) =>
    http.patch<Work>(`/works/${id}/progress`, body),
  close: (id: Id, closure_remarks: string) => http.post<Work>(`/works/${id}/close`, { closure_remarks }),
  // Take up an open (unassigned) work in the engineer's jurisdiction.
  claim: (id: Id) => http.post<Work>(`/works/${id}/claim`),
  // Photos attached to the work (Before/After), oldest first.
  attachments: (id: Id) => http.get<WorkAttachment[]>(`/works/${id}/attachments`),
};

// ---------------- Work categories ----------------
export const workCategories = {
  list: () => http.get<WorkCategory[]>('/work-categories'),
};

// ---------------- Jurisdiction ----------------
export const jurisdiction = {
  // Reverse-geocode a point to its ward + hierarchy names, plus whether it lies
  // within the caller's own jurisdiction.
  resolvePoint: (lat: number, lng: number) =>
    http.post<ResolvedPoint>('/jurisdiction/resolve-point', { lat, lng }),
};

// ---------------- Activities ----------------
export const activities = {
  mine: () => http.get<Activity[]>('/activities/me'),
  create: (body: Record<string, unknown>) => http.post<Activity>('/activities', body),
};

// ---------------- Attachments ----------------
export const attachments = {
  upload: (entity_type: 'work' | 'activity', entity_id: Id, photo: Photo, meta: AttachmentMeta = {}) =>
    http.post<WorkAttachment>('/attachments', photoForm({ entity_type, entity_id, ...meta }, photo, 'file')),
};
