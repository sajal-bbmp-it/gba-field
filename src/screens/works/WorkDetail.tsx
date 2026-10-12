import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CameraCapture from '../../components/CameraCapture';
import ChipGroup from '../../components/ChipGroup';
import KeyboardAwareScroll from '../../components/KeyboardAwareScroll';
import type { Work } from '../../types/models';
import LocationPanel from './LocationPanel';
import { useWorkDetail } from './useWorkDetail';
import { styles } from './works.styles';

interface Props {
  work: Work;
  catName?: string;
  onBack: () => void;
  onChanged: () => void;
}

export default function WorkDetail({ work, catName, onBack, onChanged }: Props) {
  const d = useWorkDetail(work, onChanged);

  return (
    <KeyboardAwareScroll>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.link}>← Back to works</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.workTitle}>{work.title}</Text>
        <Text style={[styles.badge, styles.badgeBlockTight, { backgroundColor: d.badge.color }]}>{d.badge.label}</Text>
        {!!catName && <Text style={[styles.muted, styles.mt8]}>Category: {catName}</Text>}
        {!!work.description && <Text style={[styles.muted, styles.mt6]}>{work.description}</Text>}
        {!!d.trail && <Text style={[styles.muted, styles.mt6]}>📌 {d.trail}</Text>}
        {work.is_self_assigned && <Text style={[styles.badge, styles.badgeMuted, styles.badgeBlock]}>Self-assigned</Text>}
        {work.is_outside_office && (
          <Text style={[styles.badge, styles.badgeDanger, styles.badgeBlock]}>Outside jurisdiction</Text>
        )}
        {!!work.remarks && <Text style={[styles.muted, styles.mt6]}>Remarks: {work.remarks}</Text>}
      </View>

      {d.canEditDetails && !d.editing && (
        <TouchableOpacity style={[styles.btn, styles.ghost, styles.mb12]} onPress={d.startEdit}>
          <Text style={[styles.btnText, styles.ghostText]}>✎ Edit details</Text>
        </TouchableOpacity>
      )}

      {d.canEditDetails && d.editing && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit details</Text>
          <Text style={styles.label}>Title *</Text>
          <TextInput style={styles.input} value={d.eTitle} onChangeText={d.setETitle} placeholder="Work title" />
          <Text style={[styles.label, styles.mt10]}>Category</Text>
          <ChipGroup options={d.editCategoryChoices} selected={d.eCat} onSelect={d.setECat} />
          <Text style={[styles.label, styles.mt10]}>Description</Text>
          <TextInput
            style={styles.textarea}
            multiline
            value={d.eDesc}
            onChangeText={d.setEDesc}
            placeholder="Describe the work…"
          />
          {!!d.error && <Text style={styles.error}>{d.error}</Text>}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={d.cancelEdit}>
              <Text style={[styles.btnText, styles.ghostText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.flex1]} onPress={d.saveEdit} disabled={d.busy}>
              <Text style={styles.btnText}>{d.busy ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        <LocationPanel work={work} onDirections={d.openDirections} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Photos</Text>
        {d.photos.length === 0 ? (
          <Text style={styles.muted}>No photos uploaded for this work yet.</Text>
        ) : (
          <View style={styles.photoRow}>
            {d.photos.map(p => (
              <View key={p.id} style={styles.photoItem}>
                <Image source={p.source} style={styles.photo} resizeMode="cover" />
                <Text style={styles.photoCaption}>{p.caption}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {d.isOpen && (
        <>
          {!!d.error && <Text style={styles.error}>{d.error}</Text>}
          <TouchableOpacity style={styles.btn} onPress={d.claim} disabled={d.busy}>
            <Text style={styles.btnText}>{d.busy ? 'Taking up…' : '✋ Take up this work'}</Text>
          </TouchableOpacity>
        </>
      )}

      {d.isPeer && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
          <Text style={styles.muted}>{d.assigneeText}</Text>
          <Text style={[styles.progress, styles.mt8]}>Progress: {work.physical_progress}%</Text>
          <Text style={[styles.muted, styles.mt8, styles.italic]}>You can view this work only.</Text>
        </View>
      )}

      {d.isOwner && !d.done && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update progress</Text>
          <View style={styles.rowBetween}>
            <TextInput
              style={styles.pctInput}
              keyboardType="number-pad"
              maxLength={3}
              value={d.progress}
              onChangeText={d.onProgressChange}
            />
            <Text style={styles.muted}>%</Text>
            <TouchableOpacity style={[styles.btn, styles.progressSave]} onPress={d.saveProgress} disabled={d.busy}>
              <Text style={styles.btnText}>{d.busy ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.label, styles.mt12]}>Status</Text>
          <ChipGroup options={d.statusChoices} selected={d.status} onSelect={d.setStatus} />
        </View>
      )}

      {d.isOwner && !d.done && !d.closing && (
        <TouchableOpacity style={[styles.btn, styles.btnOk]} onPress={d.startClosing}>
          <Text style={styles.btnText}>✓ Close this work</Text>
        </TouchableOpacity>
      )}

      {d.isOwner && !d.done && d.closing && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Close work — photo + remarks required</Text>
          <CameraCapture onCapture={d.setPhoto} />
          <Text style={[styles.label, styles.mt12]}>Closure remarks *</Text>
          <TextInput
            style={styles.textarea}
            multiline
            value={d.remarks}
            onChangeText={d.setRemarks}
            placeholder="What was completed…"
          />
          {!!d.error && <Text style={styles.error}>{d.error}</Text>}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={d.cancelClosing}>
              <Text style={[styles.btnText, styles.ghostText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.flex1, styles.btnOk]} onPress={d.closeWork} disabled={d.busy}>
              <Text style={styles.btnText}>{d.busy ? 'Closing…' : 'Confirm Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {d.isOwner && !!d.error && !d.closing && !d.editing && <Text style={styles.error}>{d.error}</Text>}
    </KeyboardAwareScroll>
  );
}
