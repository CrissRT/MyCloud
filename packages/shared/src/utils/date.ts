import dayjs from 'dayjs';
import duration, { DurationUnitType } from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Language } from '@shared/models';

import 'dayjs/locale/en';
import 'dayjs/locale/ro';
import 'dayjs/locale/ru';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const setGloballyLanguage = (lng?: Language) => {
  if (!lng) dayjs.locale('en');
  else dayjs.locale(lng);
};

export const getDuration = (time: number, unit?: DurationUnitType, lng?: Language) => {
  setGloballyLanguage(lng);
  if (unit) return dayjs.duration(time, unit).humanize();
  return dayjs.duration(time).humanize();
};
