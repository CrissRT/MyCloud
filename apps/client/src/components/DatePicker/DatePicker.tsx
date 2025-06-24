'use client';

import { useEffect, useRef, useState } from 'react';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onDateChange?: (date: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePicker = ({ label, error, value, onDateChange, onChange, ...rest }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selected, setSelected] = useState(value ? String(value) : undefined);
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    setSelected(value ? String(value) : undefined);
  }, [value]);

  useEffect(() => {
    if (!showCalendar) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (!inputRef.current?.parentElement?.contains(e.target)) setShowCalendar(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showCalendar]);

  const onInputClick = () => setShowCalendar((v) => !v);

  const onCalendarChange = (dateStr: string) => {
    setSelected(dateStr || undefined);
    setShowCalendar(false);
    onDateChange?.(dateStr);
    // Optionally, call the native onChange if provided, with a synthetic event
    if (onChange && inputRef.current) {
      const nativeInput = inputRef.current;
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      valueSetter?.call(nativeInput, dateStr);
      const event = new Event('input', { bubbles: true });
      nativeInput.dispatchEvent(event);
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
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `${today.getFullYear()}-${m}-${d}`;
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    onCalendarChange(dateStr);
  };

  const onPrevMonth = () => {
    setMonth((prevMonth) => {
      if (prevMonth === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const onNextMonth = () => {
    setMonth((prevMonth) => {
      if (prevMonth === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const days: (number | null)[] = Array(firstDay)
      .fill(null)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    while (days.length % 7 !== 0) days.push(null);
    return (
      <div className="absolute z-50 mt-2 left-0 w-80 bg-(--bg-primary) border border-(--border-color) rounded-xl shadow-lg p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <button type="button" className="px-2 py-1 cursor-pointer" onClick={() => setYear((y) => y - 1)}>
            &lt;&lt;
          </button>
          <button type="button" className="px-2 py-1 cursor-pointer" onClick={onPrevMonth}>
            &lt;
          </button>
          <span className="font-semibold">
            {today.toLocaleString('default', { month: 'long' })} {year}
          </span>
          <button type="button" className="px-2 py-1 cursor-pointer" onClick={onNextMonth}>
            &gt;
          </button>
          <button type="button" className="px-2 py-1 cursor-pointer" onClick={() => setYear((y) => y + 1)}>
            &gt;&gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="text-center text-xs font-medium text-(--text-secondary)">
              {wd}
            </div>
          ))}
          {days.map((day, i) => (
            <button
              key={i}
              type="button"
              className={`w-8 h-8 rounded-lg text-sm cursor-pointer ${day && selected === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 'bg-(--primary) text-white' : 'hover:bg-(--border-hover)'} ${day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 'border border-(--primary)' : ''}`}
              disabled={!day}
              onClick={() => day && onDayClick(day)}
            >
              {day || ''}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <button type="button" className="text-(--primary) underline cursor-pointer" onClick={onClear}>
            Clear
          </button>
          <button type="button" className="text-(--primary) underline cursor-pointer" onClick={onToday}>
            Today
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-[1.5rem] max-w-full relative">
      {label && (
        <label htmlFor={rest.id || rest.name} className="block mb-2 text-(--text-primary)">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={selected || ''}
          onClick={onInputClick}
          readOnly
          className="appearance-none w-full py-3 px-4 rounded-xl border border-(--border-color) focus:border-(--border-hover) bg-transparent text-(--text-primary) placeholder-(--text-secondary) cursor-pointer"
          placeholder="YYYY-MM-DD"
          {...rest}
        />
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-secondary)"
          style={{ fontSize: '1.25rem' }}
        >
          <FontAwesomeIcon icon={faCalendarDays} />
        </span>
        {showCalendar && renderCalendar()}
      </div>
      {error && <p className="mt-1 text-(--error-color)">{error}</p>}
    </div>
  );
};
