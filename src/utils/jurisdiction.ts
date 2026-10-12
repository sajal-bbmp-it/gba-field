import type { JurisdictionNames } from '../types/models';

const join = (parts: Array<string | null | undefined>) => parts.filter(Boolean).join(' › ');

/** A user's own jurisdiction, zone → ward (falls back to corporation). */
export function userTrail(u: JurisdictionNames | null | undefined): string {
  if (!u) {
    return '';
  }
  return join([u.zone_name, u.division_name, u.sub_division_name, u.ward_name]) || u.corporation_name || '';
}

/** A work's full trail, ward → corporation. */
export function workTrail(w: JurisdictionNames): string {
  return join([w.ward_name, w.sub_division_name, w.division_name, w.zone_name, w.corporation_name]);
}

/** The hierarchy above a resolved point's ward, corporation → sub-division. */
export function placeTrail(p: JurisdictionNames): string {
  return join([p.corporation_name, p.zone_name, p.division_name, p.sub_division_name]);
}
