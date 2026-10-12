import type { Photo } from '../types/models';

// Build a multipart body with a photo captured from the camera. In React Native
// a file part is { uri, name, type } (NOT a Blob like on the web).
export function photoForm(
  fields: Record<string, unknown>,
  photo: Photo | null | undefined,
  photoField = 'photo',
): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      form.append(k, String(v));
    }
  });
  if (photo) {
    form.append(photoField, {
      uri: photo.uri,
      name: photo.name || 'photo.jpg',
      type: photo.type || 'image/jpeg',
    });
  }
  return form;
}
