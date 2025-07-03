import classnames from 'classnames';
import Image from 'next/image';

import { InputProps } from '@client/types';

export const Input = ({ label, icon, input, size = 'md', iconPosition = 'right', error }: InputProps) => {
  const isIconImage = icon && typeof icon === 'object' && 'src' in icon;

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm h-8',
    md: 'py-3 px-4 h-10',
    lg: 'py-4 px-5 text-lg h-12',
    xl: 'py-5 px-6 text-xl h-14'
  };

  return (
    <div className={classnames('relative', { 'mb-6': label || error })}>
      {label && (
        <div
          className={classnames('flex items-center', {
            ['mb-2']: !label?.position,
            ['mt-2']: label?.position === 'bottom',
            ['ml-2']: label?.position === 'right',
            ['mr-2']: label?.position === 'left'
          })}
        >
          <label htmlFor={input?.id || input?.name} {...label} className="text-(--text-primary)">
            {label?.text}
          </label>
        </div>
      )}

      <div className="relative w-full">
        <div
          className={classnames(
            'rounded-xl border border-(--border-color) flex items-center gap-2 focus-within:border-(--border-hover) bg-transparent',
            sizeClasses[size],
            {
              ['flex-row-reverse']: iconPosition === 'left'
            }
          )}
        >
          <input
            {...input}
            className="outline-none placeholder-(--text-secondary) w-full bg-transparent text-(--text-primary)"
          />
          {isIconImage && <Image {...icon} alt={icon.alt} loading={icon.loading || 'lazy'} />}
          {!isIconImage && icon && icon}
        </div>

        {error && <p className="mt-1 text-(--error-color)">{typeof error === 'string' ? error : 'Error'}</p>}
      </div>
    </div>
  );
};
