import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  capture: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 22,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  captureIcon: { fontSize: 26 },
  captureText: { marginTop: 6, color: colors.brand, fontWeight: '700', fontSize: 15 },
  captureHint: { marginTop: 2, color: colors.muted, fontSize: 12 },
  frame: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  media: { width: '100%', height: '100%' },
  btn: {
    marginTop: 10,
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  ghost: { backgroundColor: colors.ghost },
  btnText: { color: colors.white, fontWeight: '700' },
  ghostText: { color: colors.brand },
});
