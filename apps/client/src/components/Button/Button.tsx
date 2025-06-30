'use client';

import classNames from 'classnames';

import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { PromiseLanguage } from '@client/utils';

type Props = {
  params: PromiseLanguage;
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'error' | 'secondary';
  width?: 'full';
  icon?: React.ReactNode;
  loading?: boolean;
} & PropsWithChildren &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, icon, variant = 'filled', color = 'primary', width, loading, ...rest }: Props) => {
  const isIconOnly = !children && !!icon;

  const { t } = useTranslation();

  return (
    <button
      {...rest}
      className={classNames(
        'flex gap-1 items-center justify-center rounded cursor-pointer scale-100 hover:scale-102 transition-scale duration-200 ease-in-out',
        {
          ['p-2']: isIconOnly,
          ['m-1']: isIconOnly
        },
        {
          ['py-3']: !isIconOnly,
          ['px-6']: !isIconOnly
        },
        {
          ['bg-(--primary-color) text-white']: variant === 'filled' && color === 'primary',
          ['hover:bg-(--primary-hover)']: variant === 'filled' && color === 'primary'
        },
        {
          ['bg-(--card-bg) text-white']: variant === 'filled' && color === 'secondary',
          ['hover:bg-(--card-bg)']: variant === 'filled' && color === 'secondary'
        },
        {
          ['bg-(--error-color) text-white']: variant === 'filled' && color === 'error',
          ['hover:bg-(--error-hover)']: variant === 'filled' && color === 'error'
        },

        {
          ['border border-(--primary-color) text-(--text-primary)']: variant === 'outlined' && color === 'primary',
          ['hover:bg-(--primary-hover)']: variant === 'outlined' && color === 'primary'
        },
        {
          ['border border-(--border-color) text-(--text-secondary)']: variant === 'outlined' && color === 'secondary',
          ['hover:border-(--text-primary) hover:text-(--text-primary)']: variant === 'outlined' && color === 'secondary'
        },
        {
          ['border border-(--error-color) text-(--error-color)']: variant === 'outlined' && color === 'error',
          ['hover:bg-(--error-hover) hover:text-(--text-primary)']: variant === 'outlined' && color === 'error'
        },
        {
          ['text-(--text-primary) hover:text-(--text-secondary)']: variant === 'text' && color === 'primary'
        },
        {
          ['text-(--text-secondary) hover:text-(--text-primary)']: variant === 'text' && color === 'secondary'
        },
        {
          ['text-(--error-color) hover:text-(--error-hover)']: variant === 'text' && color === 'error'
        },
        {
          ['w-full']: width === 'full'
        },
        {
          'cursor-not-allowed': loading
        }
      )}
      disabled={loading}
    >
      {loading ? (
        <>
          <svg
            className="mr-3 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {t('common.loading')}...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};
