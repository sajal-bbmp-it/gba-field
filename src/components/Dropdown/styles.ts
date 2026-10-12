import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  wrap: { flex: 1 },
  dd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  label: { color: colors.muted, fontSize: 11 },
  value: { color: colors.text, fontSize: 16, fontWeight: '700' },
  caret: { color: colors.muted, fontSize: 16 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 40 },
  sheet: { backgroundColor: colors.white, borderRadius: 12, paddingVertical: 6, maxHeight: 360 },
  item: { paddingVertical: 12, paddingHorizontal: 18 },
  itemText: { fontSize: 16, color: colors.text },
  itemTextOn: { color: colors.brand, fontWeight: '700' },
});
