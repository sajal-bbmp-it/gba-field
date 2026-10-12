import { useCallback, useEffect, useMemo, useState } from 'react';
import { attendance } from '../../api/endpoints';
import { apiError } from '../../api/errors';
import type { AttendanceSummary } from '../../types/models';
import { MONTHS } from '../../utils/date';
import { monthOptions, visibleDays, yearOptions } from './attendance.utils';

export function useLogView() {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await attendance.summary(year, month));
    } catch (err) {
      setError(apiError(err, 'Could not load the attendance log.'));
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    monthLabel: MONTHS[month - 1],
    yearLabel: String(year),
    monthChoices: monthOptions(year, now),
    yearChoices: yearOptions(now),
    setMonth,
    setYear,
    totals: {
      working: data?.total_working_days ?? '—',
      success: data?.success ?? 0,
      absent: data?.absent ?? 0,
      alert: data?.alert ?? 0,
    },
    days: visibleDays(data),
    loading,
    error,
  };
}
