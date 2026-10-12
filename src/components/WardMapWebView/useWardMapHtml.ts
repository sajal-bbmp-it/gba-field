import { useMemo } from 'react';
import { buildMapHtml, type MapInput } from './buildMapHtml';

// Rebuild the page only when the inputs change, so the WebView doesn't reload.
export function useWardMapHtml({ boundary, position, accuracy, inside }: MapInput): string {
  const lat = position?.lat;
  const lng = position?.lng;
  return useMemo(
    () =>
      buildMapHtml({
        boundary,
        position: lat != null && lng != null ? { lat, lng } : null,
        accuracy,
        inside,
      }),
    [boundary, lat, lng, accuracy, inside],
  );
}
