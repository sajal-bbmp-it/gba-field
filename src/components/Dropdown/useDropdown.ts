import { useCallback, useState } from 'react';

export function useDropdown<T>(onSelect: (value: T) => void) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const choose = useCallback(
    (value: T) => {
      onSelect(value);
      setOpen(false);
    },
    [onSelect],
  );
  return { open, show, hide, choose };
}
