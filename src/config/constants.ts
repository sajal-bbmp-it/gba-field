// This app is for field engineers only; managers use the web dashboard.
export const ENGINEER_ROLES = ['ae', 'aee', 'ee'];

// GPS accuracy hint (metres). The server is the source of truth; this only
// drives the client-side "weak signal" gate when the ward has no own limit.
export const ACCURACY_HINT_M = 100;

// Upload size caps (MB). MUST match the backend (api/app/config.py:
// MAX_PHOTO_MB / MAX_VIDEO_MB).
export const MAX_PHOTO_MB = 10;
export const MAX_VIDEO_MB = 50;

export const ACTIVITY_CATEGORIES = [
  'Field Inspection',
  'Meeting',
  'Site Visit',
  'Road/Pothole Repair',
  'Work Supervision',
  'Complaint Inspection',
  'Other Official Duty',
];

// Statuses an engineer can set while a work is in progress (completing goes
// through the separate "Close" flow, which also enforces photo + remarks).
export const WORK_PROGRESS_STATUSES = [
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'delayed', label: 'Delayed' },
];

// Office hours shown in the late / early alerts (computed server-side).
export const OFFICE_START_LABEL = '10:15 AM';
export const OFFICE_END_LABEL = '5:30 PM';
