import type { ImageURISource } from 'react-native';
import { getToken } from '../../api/tokenStore';
import { API_BASE_URL } from '../../config/env';
import { badgeColor, colors, workStatusLabel } from '../../theme';
import type { GeoFix, Photo, User, Work, WorkCategory } from '../../types/models';

export function statusBadge(status: string) {
  return { label: workStatusLabel[status] || status, color: badgeColor[status] || colors.muted };
}

/** Caption for a work photo's phase tag. */
export function phaseLabel(phase?: string | null): string {
  if (phase === 'before') {
    return 'Before';
  }
  if (phase === 'after') {
    return 'After';
  }
  if (phase === 'progress') {
    return 'Progress';
  }
  return 'Photo';
}

// <Image> source for an authenticated /uploads file (the media route needs the
// bearer token; RN <Image> can send it via source headers).
export function authImageSource(fileUrl: string): ImageURISource {
  const token = getToken();
  return {
    uri: `${API_BASE_URL}${fileUrl}`,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
}

export const categoryOptions = (cats: WorkCategory[]) => cats.map(c => ({ label: c.name, value: c.id }));

export const hasLocation = (w: Work): w is Work & { lat: number; lng: number } => w.lat != null && w.lng != null;

/** An open (unassigned) work can be taken up by an engineer. */
export const isOpenWork = (w: Work) => w.assigned_to == null;

/** Who may do what with a work. */
export function workAccess(work: Work, user: User | null) {
  const isOpen = isOpenWork(work);
  // Only the engineer who took the work up may act on it; peers get read-only.
  const isOwner = !isOpen && work.assigned_to === user?.id;
  const done = work.status === 'completed';
  return {
    isOpen,
    isOwner,
    isPeer: !isOpen && !isOwner,
    done,
    // Engineers may edit their OWN self-created work until it is completed.
    canEditDetails: !!work.is_self_assigned && isOwner && !done,
  };
}

/** Progress status to preselect (completed/open aren't settable here). */
export const initialProgressStatus = (w: Work) => (['completed', 'open'].includes(w.status) ? 'in_progress' : w.status);

export interface NewWorkInput {
  title: string;
  categoryId: number | null;
  coords: GeoFix | null;
  photo: Photo | null;
  mocked: boolean;
  inside: boolean | null;
  remarks: string;
}

/** First validation error for the New Work form, or null. */
export function validateNewWork(f: NewWorkInput): string | null {
  if (!f.title.trim()) {
    return 'Title is required.';
  }
  if (!f.categoryId) {
    return 'Please pick a category.';
  }
  if (!f.coords) {
    return 'Please capture the work location.';
  }
  if (!f.photo) {
    return 'A live geo-tagged photo of the site is required.';
  }
  if (f.mocked) {
    return 'A fake / mock GPS location was detected. Disable it and recapture your location.';
  }
  if (f.inside === false && !f.remarks.trim()) {
    return 'This location is outside your boundary. Remarks are mandatory to create work here.';
  }
  return null;
}

// Send the engineer's own jurisdiction (a valid path for schema validation);
// the server files the work at the captured point's real ward and flags it
// outside-office when beyond the engineer's boundary.
export function buildCreateBody(
  user: User,
  fields: { title: string; categoryId: number; description: string; remarks: string },
  fix: GeoFix,
) {
  const body: Record<string, unknown> = {
    title: fields.title.trim(),
    category_id: fields.categoryId,
    description: fields.description.trim() || null,
    jurisdiction_level: user.jurisdiction_level,
    corporation_id: user.corporation_id,
    zone_id: user.zone_id,
    division_id: user.division_id,
    sub_division_id: user.sub_division_id,
    ward_id: user.ward_id,
    lat: fix.lat,
    lng: fix.lng,
    is_mock: fix.mocked,
  };
  if (fields.remarks.trim()) {
    body.remarks = fields.remarks.trim();
  }
  return body;
}

export function buildUpdateBody(work: Work, fields: { title: string; categoryId: number; description: string }) {
  return {
    title: fields.title.trim(),
    category_id: fields.categoryId,
    description: fields.description.trim() || null,
    jurisdiction_level: work.jurisdiction_level,
    corporation_id: work.corporation_id,
    zone_id: work.zone_id,
    division_id: work.division_id,
    sub_division_id: work.sub_division_id,
    ward_id: work.ward_id,
  };
}

/** Geo-tag metadata for an uploaded work photo. */
export function photoMeta(fix: GeoFix | null, phase: 'before' | 'after') {
  if (!fix) {
    return { phase };
  }
  return {
    lat: fix.lat,
    lng: fix.lng,
    accuracy: fix.accuracy,
    taken_at: new Date().toISOString(),
    is_mock: fix.mocked,
    phase,
  };
}
