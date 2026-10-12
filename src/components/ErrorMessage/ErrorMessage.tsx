import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../../theme';
import { styles } from './styles';

interface Props {
  message?: string | null;
  style?: StyleProp<ViewStyle>;
}

// A red alert-circle icon.
function ErrorIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={colors.danger} />
      <Path d="M12 6.5v7" stroke={colors.white} strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx={12} cy={17.25} r={1.4} fill={colors.white} />
    </Svg>
  );
}

// An inline error banner: red icon + message. Renders nothing when there is no message.
export default function ErrorMessage({ message, style }: Props) {
  if (!message) {
    return null;
  }
  return (
    <View style={[styles.wrap, style]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <ErrorIcon />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
