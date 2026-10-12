import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export interface ChipOption<T> {
  label: string;
  value: T;
}

interface Props<T> {
  options: ChipOption<T>[];
  selected: T | null;
  onSelect: (value: T) => void;
}

// A wrap of single-select pill buttons.
export default function ChipGroup<T extends string | number>({ options, selected, onSelect }: Props<T>) {
  return (
    <View style={styles.chips}>
      {options.map(o => {
        const on = o.value === selected;
        return (
          <TouchableOpacity key={String(o.value)} onPress={() => onSelect(o.value)} style={[styles.chip, on && styles.chipOn]}>
            <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
