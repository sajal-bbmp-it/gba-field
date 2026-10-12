import { useState } from 'react';

export type AttendanceTab = 'mark' | 'log';

export function useAttendanceScreen() {
  const [tab, setTab] = useState<AttendanceTab>('mark');
  return { tab, showMark: () => setTab('mark'), showLog: () => setTab('log') };
}
