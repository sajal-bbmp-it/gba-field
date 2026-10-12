import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  TextInput,
  type KeyboardEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

const MARGIN = 20;

// Keeps the focused text box above the on-screen keyboard without relying on
// KeyboardAvoidingView / windowSoftInputMode:
//   1. adds bottom padding == keyboard height so there is always room to scroll,
//   2. on keyboard-show, measures the focused input and scrolls it into view.
export function useKeyboardAwareScroll() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsetY = useRef(0);
  const [kbHeight, setKbHeight] = useState(0);

  const ensureFocusedVisible = useCallback((keyboardHeight: number) => {
    const scroll = scrollRef.current;
    const focused = TextInput.State?.currentlyFocusedInput?.();
    if (!scroll || !focused || typeof focused.measureInWindow !== 'function') {
      return;
    }
    const keyboardTop = Dimensions.get('window').height - keyboardHeight;
    focused.measureInWindow((_x, y, _w, h) => {
      const inputBottom = y + h;
      if (inputBottom > keyboardTop - MARGIN) {
        const delta = inputBottom - (keyboardTop - MARGIN);
        scroll.scrollTo({ y: offsetY.current + delta, animated: true });
      }
    });
  }, []);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = (e: KeyboardEvent) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKbHeight(h);
      // Let the padding take effect, then lift the focused field into view.
      setTimeout(() => ensureFocusedVisible(h), Platform.OS === 'ios' ? 10 : 80);
    };
    const s1 = Keyboard.addListener(showEvt, onShow);
    const s2 = Keyboard.addListener(hideEvt, () => setKbHeight(0));
    return () => {
      s1.remove();
      s2.remove();
    };
  }, [ensureFocusedVisible]);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetY.current = e.nativeEvent.contentOffset.y;
  }, []);

  return { scrollRef, kbHeight, onScroll };
}
