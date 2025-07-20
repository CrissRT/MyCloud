'use client';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const UploadDnD = () => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickInput = () => inputRef.current?.click();

  return (
    <div
      className="rounded-lg border border-dashed border-(--border-color) px-8 py-12 hover:border-(--primary-hover) hover:background-opacity w-full text-(--text-primary) flex flex-col gap-5 justify-center items-center cursor-pointer"
      onClick={onClickInput}
    >
      <FontAwesomeIcon icon={faCloudArrowUp} className="text-(--text-secondary) text-4xl" />
      <input type="file" ref={inputRef} className="hidden opacity-0 fixed" />
      <div className="flex flex-col gap-3 justify-center items-center text-center">
        <h4 className="text-(--text-primary) text-bold text-2xl">{t('common.upload.dragAndDrop')}</h4>
        <p className="text-(--text-secondary)">{t('common.upload.supportMultipleFiles')}</p>
      </div>
    </div>
  );
};
