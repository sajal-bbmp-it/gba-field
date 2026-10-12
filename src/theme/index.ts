// Shared colours + a few style tokens so the screens look consistent.
export const colors = {
  brand: '#0e7c73',
  brandLight: '#14a89b',
  bg: '#f1f5f9',
  card: '#ffffff',
  text: '#1f2733',
  muted: '#64748b',
  border: '#e2e8f0',
  ok: '#16a34a',
  warn: '#d97706',
  danger: '#e23b3b',
  info: '#2563eb',
  white: '#ffffff',
  ghost: '#eef2f7',
  dangerBg: '#fde8e8',
  infoBg: '#e8f0fe',
};

export const badgeColor: Record<string, string> = {
  open: colors.info,
  assigned: colors.info,
  in_progress: colors.warn,
  delayed: colors.danger,
  completed: colors.ok,
};

export const workStatusLabel: Record<string, string> = {
  open: 'Open',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  delayed: 'Delayed',
  completed: 'Completed',
};
