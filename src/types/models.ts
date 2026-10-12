// Shapes returned by the FastAPI backend (field-engineer subset).

export type Id = number;

export interface JurisdictionNames {
  corporation_name?: string | null;
  zone_name?: string | null;
  division_name?: string | null;
  sub_division_name?: string | null;
  ward_name?: string | null;
}

export interface JurisdictionIds {
  jurisdiction_level?: string | null;
  corporation_id?: Id | null;
  zone_id?: Id | null;
  division_id?: Id | null;
  sub_division_id?: Id | null;
  ward_id?: Id | null;
}

export interface User extends JurisdictionNames, JurisdictionIds {
  id: Id;
  name: string;
  role: string;
  mobile?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface OtpRequestResponse {
  message?: string;
}

/** A device GPS fix. `mocked` is true when it came from a mock provider. */
export interface GeoFix {
  lat: number;
  lng: number;
  accuracy: number;
  mocked: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** A multipart file part as React Native expects it. */
export interface Photo {
  uri: string;
  name: string;
  type: string;
}

export interface AttendanceRecord {
  id?: Id;
  att_date: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  is_late?: boolean;
  is_early?: boolean;
  is_outside_office?: boolean;
  working_hours?: number | null;
  status?: string;
}

export interface AttendanceDay {
  date: string;
  status: string; // success | alert | absent | weekend | future | before_joining
  check_in_time?: string | null;
  check_out_time?: string | null;
  is_late?: boolean;
  is_early?: boolean;
  is_outside_office?: boolean;
  working_hours?: number | null;
}

export interface AttendanceSummary {
  days?: AttendanceDay[];
  total_working_days?: number;
  success?: number;
  absent?: number;
  alert?: number;
}

export interface WardBoundary {
  geojson?: unknown;
  max_accuracy_m?: number | null;
}

export interface LocationCheck {
  inside: boolean;
}

export interface CheckPayload {
  lat: number;
  lng: number;
  accuracy: number;
  is_mock: boolean;
  photo: Photo;
  remarks?: string;
}

export interface Work extends JurisdictionNames, JurisdictionIds {
  id: Id;
  title: string;
  status: string;
  category_id: Id | null;
  description?: string | null;
  remarks?: string | null;
  assigned_to?: Id | null;
  assignee_name?: string | null;
  assignee_role?: string | null;
  physical_progress: number;
  is_self_assigned?: boolean;
  is_outside_office?: boolean;
  lat?: number | null;
  lng?: number | null;
}

export interface WorkCategory {
  id: Id;
  name: string;
}

export interface WorkAttachment {
  id: Id;
  file_url: string;
  phase?: string | null;
}

export interface Activity {
  id: Id;
  category: string;
  description: string;
  location?: string | null;
  activity_time: string;
}

export interface ResolvedPoint extends JurisdictionNames {
  found: boolean;
  inside_jurisdiction: boolean | null;
}

export interface AttachmentMeta {
  lat?: number;
  lng?: number;
  accuracy?: number;
  taken_at?: string;
  is_mock?: boolean;
  phase?: 'before' | 'after' | 'progress';
}
