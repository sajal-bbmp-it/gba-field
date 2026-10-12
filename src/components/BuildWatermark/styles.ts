import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  pill: {
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  label: { color: colors.white, fontWeight: '800', fontSize: 10, letterSpacing: 1 },
});
