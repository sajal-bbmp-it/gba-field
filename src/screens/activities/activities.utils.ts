import { ACTIVITY_CATEGORIES } from '../../config/constants';
import type { GeoFix, Photo } from '../../types/models';

export const activityCategoryOptions = ACTIVITY_CATEGORIES.map(c => ({ label: c, value: c }));

export interface NewActivityInput {
  description: string;
  photo: Photo | null;
  coords: GeoFix | null;
  mocked: boolean;
  inside: boolean | null;
  remarks: string;
}

/** First validation error for the Log Activity form, or null. */
export function validateNewActivity(f: NewActivityInput): string | null {
  if (!f.description.trim()) {
    return 'Description is required.';
  }
  if (!f.photo) {
    return 'A live geo-tagged photo is required.';
  }
  if (!f.coords) {
    return 'Please capture your location first.';
  }
  if (f.mocked) {
    return 'A fake / mock GPS location was detected. Disable it and recapture your location.';
  }
  if (f.inside === false && !f.remarks.trim()) {
    return 'This location is outside your boundary. Remarks are mandatory to log an activity here.';
  }
  return null;
}

export function buildActivityBody(
  fields: { category: string; description: string; location: string; remarks: string },
  fix: GeoFix,
) {
  return {
    category: fields.category,
    description: fields.description.trim(),
    location: fields.location.trim() || null,
    lat: fix.lat,
    lng: fix.lng,
    remarks: fields.remarks.trim() || null,
    activity_time: new Date().toISOString(),
    is_mock: fix.mocked,
  };
}
