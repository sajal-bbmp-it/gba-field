import React, { type ReactElement, type ReactNode } from 'react';
import { ScrollView, type RefreshControlProps, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from './styles';
import { useKeyboardAwareScroll } from './useKeyboardAwareScroll';

interface Props {
  children: ReactNode;
  refreshControl?: ReactElement<RefreshControlProps>;
  contentStyle?: StyleProp<ViewStyle>;
}

// An always-scrollable ScrollView that keeps the focused text box above the keyboard.
export default function KeyboardAwareScroll({ children, refreshControl, contentStyle }: Props) {
  const { scrollRef, kbHeight, onScroll } = useKeyboardAwareScroll();
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={[styles.content, contentStyle, { paddingBottom: 32 + kbHeight }]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      scrollEventThrottle={16}
      onScroll={onScroll}>
      {children}
    </ScrollView>
  );
}
