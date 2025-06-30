'use client';

import classNames from 'classnames';
import dayjs from 'dayjs';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faAnglesLeft, faArrowLeft, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getWeekdaysShort } from '@shared/utils';

interface Props {
  label?: { text: string } & React.InputHTMLAttributes<HTMLLabelElement>;
  error?: string;
  input?: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: (instance: HTMLInputElement | null) => void;
  };
}

const getDaysInMonth = (year: number, month: number) =>
  dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`).daysInMonth();

const getFirstDayOfWeek = (year: number, month: number) => {
  const firstDay = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`).day();
  return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, and shift others to start from Monday
};

const getMonthName = (year: number, month: number, lng: string = 'en') =>
  dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`)
    .locale(lng)
    .format('MMMM');

export const DatePicker = ({ label, error, input }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [selected, setSelected] = useState(input?.value ? input.value : undefined);
  const today = dayjs();
  const [monthYear, setMonthYear] = useState(() => ({ month: today.month(), year: today.year() }));
  const month = monthYear.month;
  const year = monthYear.year;
  const { t, i18n } = useTranslation();

  const combinedRefCallback = (element: HTMLInputElement | null) => {
    if (input?.ref) input.ref(element);
    inputRef.current = element;
  };

  useEffect(() => {
    setSelected(input?.value ? String(input.value) : undefined);
  }, [input?.value]);

  useEffect(() => {
    if (!showCalendar) return;
    setMeasured(false);
    // Wait for calendar to render, then measure
    setTimeout(() => {
      const calendar = calendarRef.current;
      if (inputRef.current && calendar) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const calendarRect = calendar.getBoundingClientRect();
        const spaceBelow = window.innerHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;
        if (spaceBelow < calendarRect.height && spaceAbove > calendarRect.height) setOpenAbove(true);
        else setOpenAbove(false);

        setMeasured(true);
      }
    }, 0);
  }, [showCalendar, month, year, inputRef]);

  const onInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCalendar((v) => !v);
    setMeasured(false);
  };

  const onClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!showCalendar) return;

      // Check if the event target is a Node (for type safety)
      if (!(event.target instanceof Node)) return;

      // Check if the click was outside the container
      if (containerRef.current && !containerRef.current.contains(event.target)) setShowCalendar(false);
    },
    [showCalendar]
  );

  useEffect(() => {
    if (!showCalendar) return;

    const handleClickOutside = (event: MouseEvent) => onClickOutside(event);

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar, onClickOutside]);

  const onCalendarChange = (dateStr: string) => {
    setSelected(dateStr || undefined);
    setShowCalendar(false);
    // Trigger react-hook-form's onChange if provided
    if (input?.onChange && inputRef.current) {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      valueSetter?.call(inputRef.current, dateStr);
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  const onDayClick = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    onCalendarChange(dateStr);
  };

  const onClear = () => onCalendarChange('');

  const onToday = () => {
    setMonthYear({ month: today.month(), year: today.year() });
    const m = String(today.month() + 1).padStart(2, '0');
    const d = String(today.date()).padStart(2, '0');
    const dateStr = `${today.year()}-${m}-${d}`;
    onCalendarChange(dateStr);
  };

  const onPrevMonth = () => {
    setMonthYear(({ month, year }) => {
      if (month === 0) return { month: 11, year: year - 1 };

      return { month: month - 1, year };
    });
  };

  const onNextMonth = () => {
    setMonthYear(({ month, year }) => {
      if (month === 11) return { month: 0, year: year + 1 };

      return { month: month + 1, year };
    });
  };

  const renderCalendar = (hidden = false) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const days: (number | null)[] = Array(firstDay)
      .fill(null)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    while (days.length % 7 !== 0) days.push(null);
    return (
      <div
        ref={calendarRef}
        className={classNames(
          'absolute z-50 left-0 w-80 bg-(--bg-color) border border-(--border-color) rounded-xl shadow-lg p-4 animate-fade-in',
          {
            'bottom-full mb-2': openAbove,
            'top-full mt-2': !openAbove,
            invisible: hidden,
            ['pointer-events-none']: hidden,
            'left-[-9999px]': hidden
          }
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            className="px-2 py-1 cursor-pointer"
            onClick={() => setMonthYear(({ month, year }) => ({ month, year: year - 1 }))}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button type="button" className="px-2 py-1 cursor-pointer" onClick={onPrevMonth}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span className="font-semibold">
            {getMonthName(year, month, i18n.language)} {year}
          </span>
          <button type="button" className="px-2 py-1 cursor-pointer" onClick={onNextMonth}>
            <FontAwesomeIcon icon={faArrowLeft} className="rotate-180" />
          </button>
          <button
            type="button"
            className="px-2 py-1 cursor-pointer"
            onClick={() => setMonthYear(({ month, year }) => ({ month, year: year + 1 }))}
          >
            <FontAwesomeIcon icon={faAnglesLeft} className="rotate-180" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {getWeekdaysShort(i18n.language).map((wd) => (
            <div key={wd} className="text-center text-xs font-medium text-(--text-secondary)">
              {wd}
            </div>
          ))}
          {days.map((day, i) => {
            const isSelected =
              day && selected === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = day === today.date() && month === today.month() && year === today.year();

            return (
              <button
                key={i}
                type="button"
                className={classNames('w-8 h-8 rounded-lg text-sm cursor-pointer', {
                  'bg-(--primary) text-white': isSelected,
                  'hover:bg-(--border-hover)': !isSelected,
                  'border border-(--primary)': isToday
                })}
                disabled={!day}
                onClick={() => day && onDayClick(day)}
              >
                {day || ''}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <button type="button" className="text-(--primary) underline cursor-pointer" onClick={onClear}>
            {t('common.clear')}
          </button>
          <button type="button" className="text-(--primary) underline cursor-pointer" onClick={onToday}>
            {t('common.today')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6 max-w-full relative" ref={containerRef}>
      {label && (
        <label htmlFor={label.id || label.name} {...label} className="block mb-2 text-(--text-primary)">
          {label.text}
        </label>
      )}
      <div className="relative w-full">
        <input
          {...input}
          ref={combinedRefCallback}
          type="text"
          value={selected || ''}
          onClick={onInputClick}
          readOnly
          className="appearance-none w-full py-3 px-4 rounded-xl border border-(--border-color) focus-within:border-(--border-hover) bg-transparent text-(--text-primary) placeholder-(--text-secondary) cursor-pointer outline-none focus:outline-none"
          placeholder="YYYY-MM-DD"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-secondary) text-xl">
          <FontAwesomeIcon icon={faCalendarDays} />
        </span>
        {showCalendar && !measured && renderCalendar(true)}
        {showCalendar && measured && renderCalendar(false)}
      </div>
      {error && <p className="mt-1 text-(--error-color)">{error}</p>}
    </div>
  );
};
