// Decode a base64url JWT segment without relying on atob (not guaranteed on
// every JS engine). We only need ASCII JSON, so a minimal decoder is enough.
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64UrlDecode(input: string): string {
  let str = input.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  let output = '';
  let bc = 0;
  let bs = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '=') {
      break;
    }
    const idx = B64.indexOf(c);
    if (idx === -1) {
      continue;
    }
    bs = bc % 4 ? bs * 64 + idx : idx;
    if (bc++ % 4) {
      // eslint-disable-next-line no-bitwise
      output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
    }
  }
  return output;
}

export function decodeJwt(token: string): { exp?: number } | null {
  try {
    return JSON.parse(base64UrlDecode(token.split('.')[1]));
  } catch {
    return null;
  }
}

/** Epoch ms at which the token expires, or null if it has no usable `exp`. */
export function jwtExpiry(token: string | null): number | null {
  if (!token) {
    return null;
  }
  const payload = decodeJwt(token);
  return payload?.exp ? payload.exp * 1000 : null;
}
