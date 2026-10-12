import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { CameraFacing } from '../../services/camera';
import type { Photo } from '../../types/models';
import { styles } from './styles';
import { useCameraCapture } from './useCameraCapture';

interface Props {
  onCapture: (photo: Photo | null) => void;
  label?: string;
  defaultFacing?: CameraFacing;
}

// Captures a live photo by launching the native camera on tap. Calls
// onCapture(photo) when taken, or onCapture(null) on retake.
export default function CameraCapture({ onCapture, label = 'Capture Photo', defaultFacing = 'back' }: Props) {
  const { photo, busy, snap, retake } = useCameraCapture(onCapture, defaultFacing);

  if (photo) {
    return (
      <View>
        <View style={styles.frame}>
          <Image source={{ uri: photo.uri }} style={styles.media} />
        </View>
        <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={retake}>
          <Text style={[styles.btnText, styles.ghostText]}>↺ Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.capture} onPress={snap} disabled={busy}>
      <Text style={styles.captureIcon}>📷</Text>
      <Text style={styles.captureText}>{busy ? 'Opening camera…' : label}</Text>
      <Text style={styles.captureHint}>Opens the camera · live photo only</Text>
    </TouchableOpacity>
  );
}
