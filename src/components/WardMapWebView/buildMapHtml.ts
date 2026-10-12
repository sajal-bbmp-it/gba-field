import type { LatLng } from '../../types/models';

export interface MapInput {
  boundary?: unknown; // GeoJSON geometry or Feature
  position?: LatLng | null;
  accuracy?: number | null;
  inside?: boolean | null;
}

export function statusColorFor(inside: boolean | null | undefined): string {
  if (inside === true) {
    return '#16a34a';
  }
  if (inside === false) {
    return '#e23b3b';
  }
  return '#2563eb';
}

// JSON for inlining into a <script>: escape "<" so data can't close the tag.
const toJs = (v: unknown) => JSON.stringify(v ?? null).replace(/</g, '\\u003c');

// Leaflet page (OpenStreetMap tiles, no API key) drawing the ward outline, the
// GPS pin and its accuracy circle.
export function buildMapHtml({ boundary, position, accuracy, inside }: MapInput): string {
  const acc = accuracy != null ? Number(accuracy) : null;
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#map{height:100%;margin:0;padding:0;background:#e5e7eb}</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var boundary = ${toJs(boundary)}, pos = ${toJs(position)}, acc = ${toJs(acc)}, statusColor = ${toJs(statusColorFor(inside))};
  var map = L.map('map', { zoomControl: true, attributionControl: false })
    .setView(pos ? [pos.lat, pos.lng] : [12.9716, 77.5946], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  var bounds = null;
  if (boundary) {
    var feature = boundary.type === 'Feature' ? boundary : { type: 'Feature', geometry: boundary, properties: {} };
    var layer = L.geoJSON(feature, { style: { color: '#2563eb', weight: 2, fillColor: '#2563eb', fillOpacity: 0.12 } }).addTo(map);
    bounds = layer.getBounds();
  }
  if (pos) {
    if (acc) {
      L.circle([pos.lat, pos.lng], { radius: acc, color: statusColor, fillColor: statusColor, fillOpacity: 0.15, weight: 1 }).addTo(map);
    }
    L.circleMarker([pos.lat, pos.lng], { radius: 7, color: '#fff', weight: 3, fillColor: statusColor, fillOpacity: 1 }).addTo(map);
  }
  if (bounds && bounds.isValid()) { map.fitBounds(bounds, { padding: [20, 20] }); }
  else if (pos) { map.setView([pos.lat, pos.lng], 16); }
</script>
</body></html>`;
}
