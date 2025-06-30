import classNames from 'classnames';

import { PropsWithChildren } from 'react';
import { Spinner } from '@client/components';

type Props = {
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'error' | 'secondary';
  width?: 'full';
  icon?: React.ReactNode;
  loading?: boolean;
} & PropsWithChildren &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, icon, variant = 'filled', color = 'primary', width, loading, ...rest }: Props) => {
  const isIconOnly = !children && !!icon;

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
          'cursor-wait': loading
        }
      )}
      disabled={loading}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};
