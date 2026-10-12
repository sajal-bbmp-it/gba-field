import { OFFICE_END_LABEL, OFFICE_START_LABEL } from '../../config/constants';
import { colors } from '../../theme';
import type { AttendanceDay, AttendanceRecord, AttendanceSummary } from '../../types/models';
import { fmtHours, fmtTime, MONTHS } from '../../utils/date';

// Attendance shows clock times in 24h.
export const fmtClock = (v: string | null | undefined) => fmtTime(v, false);

export const STATUS_META: Record<string, { label: string; color: string; icon: string }> = {
  success: { label: 'Success', color: colors.ok, icon: '✔' },
  alert: { label: 'Alert', color: colors.warn, icon: '⚠' },
  absent: { label: 'Absent', color: colors.danger, icon: '✖' },
  weekend: { label: 'Weekend', color: colors.muted, icon: '☰' },
};

/** Today's status lines for the Mark tab. */
export function checkedInText(rec: AttendanceRecord): string {
  return `Checked in at ${fmtClock(rec.check_in_time)}${rec.is_late ? '  ·  ⚠ Late' : ''}${
    rec.is_outside_office ? '  ·  Outside office' : ''
  }`;
}

export function completedText(rec: AttendanceRecord): string {
  return `Checked in ${fmtClock(rec.check_in_time)} · Checked out ${fmtClock(rec.check_out_time)} · ${fmtHours(
    rec.working_hours,
  )}`;
}

/** Last three years, newest first. */
export function yearOptions(now: Date) {
  const y = now.getFullYear();
  return [y, y - 1, y - 2].map(v => ({ label: String(v), value: v }));
}

/** For the current year only offer months up to the current one. */
export function monthOptions(year: number, now: Date) {
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;
  return MONTHS.map((label, i) => ({ label, value: i + 1 })).filter(m => year < curYear || m.value <= curMonth);
}

/** Newest first, without future days or days before the user joined. */
export function visibleDays(data: AttendanceSummary | null): AttendanceDay[] {
  return (data?.days || []).filter(d => d.status !== 'future' && d.status !== 'before_joining').reverse();
}

/** Everything a day row needs to render. */
export function dayView(d: AttendanceDay) {
  const meta = STATUS_META[d.status] || STATUS_META.absent;
  const isWeekend = d.status === 'weekend';
  const noPlace = isWeekend || d.status === 'absent';
  return {
    dateLabel: `${Number(d.date.slice(8, 10))} ${MONTHS[Number(d.date.slice(5, 7)) - 1]}`,
    placeLabel: noPlace ? '—' : d.is_outside_office ? '⚑ Outside' : '📍 Office',
    placeColor: isWeekend ? colors.muted : d.is_outside_office ? colors.danger : colors.ok,
    inTime: d.check_in_time ? fmtClock(d.check_in_time) : 'NA',
    outTime: d.check_out_time ? fmtClock(d.check_out_time) : 'NA',
    late: !!d.is_late,
    early: !!d.is_early,
    statusLabel: `${meta.icon} ${meta.label}`,
    statusColor: meta.color,
    hours: d.working_hours != null ? fmtHours(d.working_hours) : null,
  };
}

/** The alert shown after a successful check-in / check-out. */
export function checkResultAlert(isCheckIn: boolean, res: AttendanceRecord): { title: string; message: string } {
  if (isCheckIn && res.is_late) {
    return {
      title: '⚠ Late check-in',
      message: `You checked in at ${fmtClock(res.check_in_time)}, which is after the ${OFFICE_START_LABEL} start time. This day is flagged as an alert.`,
    };
  }
  if (!isCheckIn && res.is_early) {
    return {
      title: '⚠ Early check-out',
      message: `You checked out at ${fmtClock(res.check_out_time)}, which is before the ${OFFICE_END_LABEL} end time. This day is flagged as an alert.`,
    };
  }
  return { title: 'Success', message: isCheckIn ? 'Checked in successfully.' : 'Checked out successfully.' };
}
