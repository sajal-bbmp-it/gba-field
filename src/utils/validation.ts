export const digitsOnly = (t: string) => t.replace(/\D/g, '');

/** Indian 10-digit mobile starting 6–9. */
export const isValidMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);

export const isValidOtp = (otp: string) => /^\d{4,6}$/.test(otp);

/** Parse a percentage text field, clamped to 0–100. */
export function clampPercent(text: string): number {
  const n = parseInt(text || '0', 10);
  return Math.max(0, Math.min(100, isNaN(n) ? 0 : n));
}

export const formatCoords = (lat: number, lng: number, digits = 5) =>
  `${lat.toFixed(digits)}, ${lng.toFixed(digits)}`;
