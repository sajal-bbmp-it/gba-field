import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import CameraCapture from '../../components/CameraCapture';
import ChipGroup from '../../components/ChipGroup';
import ErrorMessage from '../../components/ErrorMessage';
import KeyboardAwareScroll from '../../components/KeyboardAwareScroll';
import { formatCoords } from '../../utils/validation';
import { styles } from './activities.styles';
import { useNewActivity } from './useNewActivity';

interface Props {
  onCancel: () => void;
  onSaved: () => void;
}

export default function NewActivity({ onCancel, onSaved }: Props) {
  const f = useNewActivity(onSaved);

  return (
    <KeyboardAwareScroll>
      <Text style={styles.title}>Log Field Activity</Text>
      <ErrorMessage message={f.error} />

      <View style={styles.card}>
        <Text style={styles.label}>Category</Text>
        <ChipGroup options={f.categoryChoices} selected={f.category} onSelect={f.setCategory} />

        <Text style={[styles.label, styles.mt12]}>Description *</Text>
        <TextInput
          style={styles.textarea}
          multiline
          value={f.description}
          onChangeText={f.setDescription}
          placeholder="What did you do…"
        />

        <Text style={[styles.label, styles.mt12]}>Location (description)</Text>
        <TextInput
          style={styles.input}
          value={f.location}
          onChangeText={f.setLocation}
          placeholder="e.g. 5th Cross, Ward 12"
        />

        <Text style={[styles.label, styles.mt12]}>Remarks</Text>
        <TextInput
          style={styles.textarea}
          multiline
          value={f.remarks}
          onChangeText={f.setRemarks}
          placeholder="Any additional notes…"
        />

        <Text style={[styles.label, styles.mt12]}>Live Photo *</Text>
        <CameraCapture onCapture={f.setPhoto} label="Capture Photo" />

        <TouchableOpacity style={[styles.btn, styles.ghost, styles.mt12]} onPress={f.grab} disabled={f.locating}>
          <Text style={[styles.btnText, styles.ghostText]}>
            {f.locating ? 'Fetching…' : f.coords ? `📍 ${formatCoords(f.coords.lat, f.coords.lng)}` : '📍 Capture Location'}
          </Text>
        </TouchableOpacity>

        {f.place?.found && (
          <View style={styles.place}>
            <Text style={styles.placeWard}>Ward: {f.place.ward_name || '—'}</Text>
            <Text style={styles.muted}>{f.placeTrail}</Text>
          </View>
        )}
        {f.place && !f.place.found && (
          <Text style={[styles.muted, styles.mt8]}>This point is outside all mapped wards.</Text>
        )}
        {f.inside === true && <Text style={[styles.badge, styles.badgeOk]}>Inside your jurisdiction</Text>}
        {f.inside === false && (
          <Text style={[styles.badge, styles.badgeDanger]}>Outside your boundary — remarks mandatory</Text>
        )}
        {f.mocked && <Text style={[styles.badge, styles.badgeDanger]}>Mock location detected — disable fake GPS</Text>}

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onCancel}>
            <Text style={[styles.btnText, styles.ghostText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.flex1]} onPress={f.submit} disabled={f.busy}>
            <Text style={styles.btnText}>{f.busy ? 'Saving…' : 'Save Activity'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScroll>
  );
}
