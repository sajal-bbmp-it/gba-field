import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import CameraCapture from '../../components/CameraCapture';
import ChipGroup from '../../components/ChipGroup';
import ErrorMessage from '../../components/ErrorMessage';
import KeyboardAwareScroll from '../../components/KeyboardAwareScroll';
import { formatCoords } from '../../utils/validation';
import { useNewWork } from './useNewWork';
import { styles } from './works.styles';

interface Props {
  onCancel: () => void;
  onSaved: () => void;
}

export default function NewWork({ onCancel, onSaved }: Props) {
  const f = useNewWork(onSaved);

  return (
    <KeyboardAwareScroll>
      <TouchableOpacity onPress={onCancel}>
        <Text style={styles.link}>← Back to works</Text>
      </TouchableOpacity>
      <Text style={styles.title}>New Work</Text>
      <ErrorMessage message={f.error} style={styles.errorSpacing} />
      <ErrorMessage message={f.catsError} style={styles.errorSpacing} />

      <View style={styles.card}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={f.title}
          onChangeText={f.setTitle}
          placeholder="e.g. Pothole filling, 5th Cross"
        />

        <Text style={[styles.label, styles.mt12]}>Category *</Text>
        {f.categoryChoices.length === 0 ? (
          <Text style={styles.muted}>{f.catsError ? '—' : 'Loading categories…'}</Text>
        ) : (
          <ChipGroup options={f.categoryChoices} selected={f.categoryId} onSelect={f.setCategoryId} />
        )}

        <Text style={[styles.label, styles.mt12]}>Description</Text>
        <TextInput
          style={styles.textarea}
          multiline
          value={f.description}
          onChangeText={f.setDescription}
          placeholder="Details of the work…"
        />

        <Text style={[styles.label, styles.mt12]}>Location *</Text>
        <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={f.grab} disabled={f.locating}>
          <Text style={[styles.btnText, styles.ghostText]}>
            {f.locating ? 'Locating…' : f.coords ? `📍 ${formatCoords(f.coords.lat, f.coords.lng)}` : '📍 Capture Location'}
          </Text>
        </TouchableOpacity>
        {f.place?.found && (
          <View style={styles.place}>
            <Text style={styles.placeWard}>Ward: {f.place.ward_name || '—'}</Text>
            <Text style={styles.muted}>{f.placeTrail}</Text>
          </View>
        )}
        {f.inside === true && (
          <Text style={[styles.badge, styles.badgeOk, styles.badgeBlock]}>Inside your jurisdiction</Text>
        )}
        {f.inside === false && (
          <>
            <Text style={[styles.badge, styles.badgeDanger, styles.badgeBlock]}>Outside your boundary</Text>
            <Text style={[styles.label, styles.mt12]}>Reason / Remarks *</Text>
            <TextInput
              style={styles.textarea}
              multiline
              value={f.remarks}
              onChangeText={f.setRemarks}
              placeholder="Why is this work outside your ward?"
            />
          </>
        )}
        {f.mocked && (
          <Text style={[styles.badge, styles.badgeDanger, styles.badgeBlock]}>
            Mock location detected — disable fake GPS
          </Text>
        )}

        <Text style={[styles.label, styles.mt12]}>Live Photo *</Text>
        <CameraCapture onCapture={f.setPhoto} label="Capture Photo" />

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onCancel}>
            <Text style={[styles.btnText, styles.ghostText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.flex1]} onPress={f.submit} disabled={f.busy}>
            <Text style={styles.btnText}>{f.busy ? 'Saving…' : 'Create Work'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScroll>
  );
}
