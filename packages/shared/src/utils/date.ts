import dayjs, { ManipulateType } from 'dayjs';
import duration, { DurationUnitType } from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Language } from '@shared/models';

import 'dayjs/locale/en';
import 'dayjs/locale/ro';
import 'dayjs/locale/ru';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getDuration = (time: number, unit?: DurationUnitType, lng?: Language) => {
  if (unit) return dayjs.duration(time, unit).humanize();
  return dayjs
    .duration(time)
    .locale(lng || 'en')
    .humanize();
};

export const isWithinLastMinutes = (
  firstDate: dayjs.ConfigType,
  secondDate: dayjs.ConfigType = dayjs(),
  subtract: { value: number; unit?: ManipulateType } = { value: 30, unit: 'minute' }
) => dayjs(firstDate).isAfter(dayjs(secondDate).subtract(subtract.value, subtract.unit));
