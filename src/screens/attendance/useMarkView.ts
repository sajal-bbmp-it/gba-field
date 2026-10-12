import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { attendance } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import type { AttendanceRecord } from '../../types/models';
import { todayISO } from '../../utils/date';

export type CheckMode = 'checkin' | 'checkout';

export function useMarkView() {
  const [rec, setRec] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<CheckMode | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const list = await attendance.mine();
      setRec(list.find(r => r.att_date === todayISO()) || null);
    } catch (err) {
      setError(apiError(err, 'Could not load attendance.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const closeWizard = useCallback(() => setMode(null), []);
  const onWizardDone = useCallback(() => {
    setMode(null);
    load();
  }, [load]);

  return {
    today: todayISO(),
    rec,
    loading,
    error,
    mode,
    checkedIn: !!rec?.check_in_time,
    checkedOut: !!rec?.check_out_time,
    startCheckIn: () => setMode('checkin'),
    startCheckOut: () => setMode('checkout'),
    closeWizard,
    onWizardDone,
  };
}
