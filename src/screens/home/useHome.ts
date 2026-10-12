import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { attendance } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import { useAuth } from '../../auth/AuthContext';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import type { MainTabsNavigation } from '../../navigation/types';
import type { AttendanceRecord } from '../../types/models';
import { fmtTime, todayISO } from '../../utils/date';
import { userTrail } from '../../utils/jurisdiction';

export function useHome() {
  const navigation = useNavigation<MainTabsNavigation>();
  const { user, logout } = useAuth();
  const [rec, setRec] = useState<AttendanceRecord | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const list = await attendance.mine();
      setRec(list.find(r => r.att_date === todayISO()) || null);
    } catch (err) {
      setError(apiError(err, 'Could not load your status.'));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  const { refreshing, onRefresh } = usePullToRefresh(load);

  const checkedIn = !!rec?.check_in_time;
  const checkedOut = !!rec?.check_out_time;

  let statusText = '';
  if (rec && checkedIn) {
    statusText = `Checked in at ${fmtTime(rec.check_in_time)}`;
    if (rec.is_outside_office) {
      statusText += '  ·  Outside office';
    }
    if (checkedOut) {
      statusText += `\nChecked out at ${fmtTime(rec.check_out_time)}  ·  ${rec.working_hours}h`;
    }
  }

  const attendanceButtonLabel = !checkedIn ? '📷 Check In' : !checkedOut ? '📷 Check Out' : 'View Attendance';

  return {
    user,
    roleLabel: user?.role?.toUpperCase() ?? '',
    trail: userTrail(user),
    error,
    refreshing,
    onRefresh,
    checkedIn,
    statusText,
    attendanceButtonLabel,
    goAttendance: () => navigation.navigate('Attendance'),
    goWorks: () => navigation.navigate('Works'),
    goActivities: () => navigation.navigate('Activities'),
    logout,
  };
}
