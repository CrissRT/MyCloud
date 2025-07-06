'use client';

import classNames from 'classnames';

import { ReactNode } from 'react';
import { Sizes } from '@client/utils';

export interface SegmentedOption {
  value: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface Props {
  options: SegmentedOption[];
  value?: string;
  onChange?: (value: string) => void;
  size?: Sizes;
  disabled?: boolean;
  className?: string;
}

export const SegmentedControl = ({ options, value, onChange, size = 'md', disabled = false, className }: Props) => {
  const sizeClasses = {
    sm: 'p-1 gap-1',
    md: 'p-1.5 gap-1',
    lg: 'p-2 gap-1.5',
    xl: 'p-2.5 gap-2'
  };

  const optionSizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl'
  };

  const onOptionClick = (optionValue: string, option: SegmentedOption) => {
    if (disabled || option.disabled) return;
    onChange?.(optionValue);
  };

  return (
    <div
      className={classNames(
        'inline-flex bg-(--bg-secondary) rounded-xl border border-(--border-color)',
        sizeClasses[size],
        {
          'opacity-50 cursor-not-allowed': disabled
        },
        className
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            className={classNames(
              'flex items-center justify-center rounded-lg transition-all duration-200 font-medium',
              optionSizeClasses[size],
              {
                'bg-(--bg-color) text-(--text-primary) shadow-sm': isSelected,
                'text-(--text-secondary) hover:text-(--text-primary)': !isSelected && !isDisabled,
                'opacity-50 cursor-not-allowed': isDisabled,
                'cursor-pointer': !isDisabled
              }
            )}
            onClick={() => onOptionClick(option.value, option)}
            disabled={isDisabled}
          >
            {option.icon && (
              <span
                className={classNames('flex items-center justify-center', {
                  'mr-2': option.label
                })}
              >
                {option.icon}
              </span>
            )}
            {option.label && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
