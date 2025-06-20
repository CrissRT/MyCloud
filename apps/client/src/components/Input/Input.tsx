import classnames from 'classnames';
import Image from 'next/image';

import { InputProps } from '@client/types';

export const Input = ({ label, icon, input, size, iconPosition = 'right' }: InputProps) => {
  const isIconImage = icon && typeof icon === 'object' && 'src' in icon;

  return (
    <div
      className={classnames('mb-[1.5rem] max-w-full', {
        ['w-2xl']: size === '2xl',
        ['w-xl']: size === 'xl',
        ['w-lg']: size === 'lg',
        flex: !!label?.position,
        ['flex-col-reverse']: label?.position === 'bottom',
        ['flex-row-reverse']: label?.position === 'right',
        ['align-items']: label?.position === 'left' || label?.position === 'right'
      })}
    >
      {label && (
        <div
          className={classnames('flex items-center', {
            ['mb-[0.5rem]']: !label?.position,
            ['mt-[0.5rem]']: label?.position === 'bottom',
            ['ml-[0.5rem]']: label?.position === 'right',
            ['mr-[0.5rem]']: label?.position === 'left'
          })}
        >
          <label htmlFor={input?.id || input?.name} className={classnames('text-(--text-primary) h-fit')}>
            {label?.text}
          </label>
        </div>
      )}
      <div
        className={classnames(
          'py-[0.75rem] px-[1rem] rounded-xl border border-(--border-color) flex items-center gap-[0.5rem]',
          {
            ['flex-row-reverse']: iconPosition === 'left'
          }
        )}
      >
        <input {...input} className="outline-none placeholder-(--text-secondary) w-full" />
        {isIconImage && icon?.src && <Image {...icon} alt={icon.alt} loading={icon.loading || 'lazy'} />}
        {!isIconImage && icon && icon}
      </div>
    </div>
  );
};
