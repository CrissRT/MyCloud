import dayjs, { ManipulateType } from 'dayjs';
import duration, { Duration, DurationUnitType } from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/en';
import 'dayjs/locale/ro';
import 'dayjs/locale/ru';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getDuration = (time: number, unit?: DurationUnitType, lng?: string) => {
  const getHumanizedAndLocalizedDuration = (duration: Duration) => duration.locale(lng || 'en').humanize();

  if (unit) return getHumanizedAndLocalizedDuration(dayjs.duration(time, unit));
  return getHumanizedAndLocalizedDuration(dayjs.duration(time));
};

export const isWithinLastMinutes = (
  firstDate: dayjs.ConfigType,
  secondDate: dayjs.ConfigType = dayjs(),
  subtract: { value: number; unit?: ManipulateType } = { value: 30, unit: 'minute' }
) => dayjs(firstDate).isAfter(dayjs(secondDate).subtract(subtract.value, subtract.unit));
