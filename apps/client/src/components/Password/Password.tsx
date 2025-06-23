'use client';

import { useTranslations } from 'next-intl';

import { useState } from 'react';
import { Input } from '@client/components';
import { InputProps } from '@client/types';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = Omit<InputProps, 'icon'> & Omit<InputProps['input'], 'type'>;

export const Password = (props: Props) => {
  const t = useTranslations('auth.login.buttons');
  const [visible, setVisible] = useState(false);

  const onToggleVisibility = () => setVisible((prev) => !prev);

  return (
    <Input
      {...props}
      input={{
        ...props.input,
        type: visible ? 'text' : 'password',
        autoComplete: props.input?.autoComplete || 'current-password'
      }}
      icon={
        <button
          type="button"
          tabIndex={-1}
          onClick={onToggleVisibility}
          aria-label={visible ? t('hidePassword') : t('showPassword')}
          className="bg-none border-none cursor-pointer p-0"
        >
          {visible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
        </button>
      }
      iconPosition={props.iconPosition || 'right'}
    />
  );
};
