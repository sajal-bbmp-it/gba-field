import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  logo: { fontSize: 40, fontWeight: '800', color: colors.brand, textAlign: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 6 },
  subtitle: { color: colors.muted, textAlign: 'center', marginBottom: 24 },
  label: { color: colors.text, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    color: colors.text,
  },
  btn: { backgroundColor: colors.brand, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  linkText: { color: colors.brandLight, textAlign: 'center', marginTop: 16 },
  error: { color: colors.danger, backgroundColor: colors.dangerBg, padding: 10, borderRadius: 8, marginBottom: 12 },
  info: { color: colors.info, backgroundColor: colors.infoBg, padding: 10, borderRadius: 8, marginBottom: 12 },
});
