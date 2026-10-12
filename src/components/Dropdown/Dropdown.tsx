import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { useDropdown } from './useDropdown';

export interface DropdownOption<T> {
  label: string;
  value: T;
}

interface Props<T> {
  label: string;
  value: string;
  options: DropdownOption<T>[];
  onSelect: (value: T) => void;
}

// Lightweight dropdown (a button that opens a modal list) — no native picker dependency.
export default function Dropdown<T extends string | number>({ label, value, options, onSelect }: Props<T>) {
  const { open, show, hide, choose } = useDropdown(onSelect);
  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.dd} onPress={show}>
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        <Text style={styles.caret}>▾</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={hide}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={hide}>
          <View style={styles.sheet}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
              {options.map(o => (
                <TouchableOpacity key={String(o.value)} style={styles.item} onPress={() => choose(o.value)}>
                  <Text style={[styles.itemText, o.label === value && styles.itemTextOn]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
