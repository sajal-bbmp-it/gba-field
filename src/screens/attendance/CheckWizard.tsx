import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import CameraCapture from '../../components/CameraCapture';
import ErrorMessage from '../../components/ErrorMessage';
import KeyboardAwareScroll from '../../components/KeyboardAwareScroll';
import WardMapWebView from '../../components/WardMapWebView';
import { styles } from './attendance.styles';
import { useCheckWizard } from './useCheckWizard';
import type { CheckMode } from './useMarkView';

interface Props {
  mode: CheckMode;
  onCancel: () => void;
  onDone: () => void;
}

export default function CheckWizard({ mode, onCancel, onDone }: Props) {
  const w = useCheckWizard(mode, onDone);

  return (
    <KeyboardAwareScroll>
      <Text style={styles.title}>{w.isCheckIn ? 'Check In' : 'Check Out'}</Text>
      <ErrorMessage message={w.error} />

      {w.step === 'selfie' ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 1 · Live Selfie</Text>
          <CameraCapture onCapture={w.setPhoto} label="Capture Selfie" defaultFacing="front" />
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onCancel}>
              <Text style={[styles.btnText, styles.ghostText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.flex1, !w.photo && styles.disabled]}
              onPress={w.openMap}
              disabled={!w.photo}>
              <Text style={styles.btnText}>Next: Open Map →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 2 · Confirm you are inside your ward</Text>
          <WardMapWebView
            boundary={w.boundary?.geojson}
            position={w.coords}
            accuracy={w.coords?.accuracy}
            inside={w.inside}
          />

          <View style={styles.statusRow}>
            {w.locating ? (
              <Text style={styles.muted}>Fetching your location…</Text>
            ) : w.coords ? (
              <Text style={styles.mono}>
                {w.coords.lat.toFixed(5)}, {w.coords.lng.toFixed(5)} · ±{Math.round(w.coords.accuracy)} m
              </Text>
            ) : (
              <Text style={styles.muted}>Location not available.</Text>
            )}
          </View>
          <View style={styles.badges}>
            {w.inside === true && <Text style={[styles.badge, styles.badgeOk]}>Inside your ward</Text>}
            {w.inside === false && <Text style={[styles.badge, styles.badgeDanger]}>Outside your ward</Text>}
            {w.poorAccuracy && <Text style={[styles.badge, styles.badgeDanger]}>GPS too weak</Text>}
            {w.mocked && <Text style={[styles.badge, styles.badgeDanger]}>Mock location</Text>}
          </View>

          {w.mocked && (
            <ErrorMessage
              style={styles.warn}
              message={
                'A fake / mock GPS location was detected. Turn off any fake-location app and disable "mock location" ' +
                'in developer settings, then tap Refresh.'
              }
            />
          )}

          <TouchableOpacity onPress={w.fetchLocation} disabled={w.locating}>
            <Text style={styles.link}>↺ Refresh location</Text>
          </TouchableOpacity>

          {w.poorAccuracy && w.coords && (
            <ErrorMessage
              style={styles.warn}
              message={
                `GPS accuracy is too weak (±${Math.round(w.coords.accuracy)} m); it must be within ` +
                `${Math.round(w.accLimit)} m. Move to an open area and tap Refresh.`
              }
            />
          )}
          {w.needRemarks && (
            <View style={styles.remarksBlock}>
              <Text style={styles.label}>Outside-ward Remarks *</Text>
              <TextInput
                style={styles.textarea}
                multiline
                value={w.remarks}
                onChangeText={w.setRemarks}
                placeholder="You are outside your ward. State the official reason to proceed…"
              />
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onCancel}>
              <Text style={[styles.btnText, styles.ghostText]}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.flex1, !w.canSubmit && styles.disabled]}
              onPress={w.submit}
              disabled={!w.canSubmit}>
              <Text style={styles.btnText}>
                {w.busy ? 'Submitting…' : w.isCheckIn ? 'Confirm Check In' : 'Confirm Check Out'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAwareScroll>
  );
}
