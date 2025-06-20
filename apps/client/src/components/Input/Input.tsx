import classnames from 'classnames';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

import React from 'react';

type CustomImageProps = {
  position?: 'left' | 'right';
} & ImageProps;

type LabelProps = {
  text: React.ReactNode | string;
  position?: 'left' | 'right' | 'bottom';
} & React.LabelHTMLAttributes<HTMLLabelElement>;

interface Props {
  label?: LabelProps;
  image?: CustomImageProps;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Input = ({ label, image, input }: Props) => {
  const { position: imagePosition, ...imageProps } = image || {};

  return (
    <div
      className={classnames('mb-[1.5rem]', {
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
            ['flex-row-reverse']: imagePosition === 'left'
          }
        )}
      >
        <input
          {...input}
          className={classnames('outline-none placeholder-(--text-secondary)', {
            ['w-full']: !image?.src
          })}
        />
        {image?.src && (
          <Image alt={image.alt || 'An Image'} src={image.src} {...imageProps} loading={image.loading || 'lazy'} />
        )}
      </div>
    </div>
  );
};
