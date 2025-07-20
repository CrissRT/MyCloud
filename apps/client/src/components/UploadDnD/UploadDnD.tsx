'use client';

import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '../Button/Button';

export const UploadDnD = () => {
  const { t } = useTranslation();
  const [inputType, setInputType] = useState<'file' | 'folder'>('file');

  const inputFilesRef = useRef<HTMLInputElement>(null);
  const inputFoldersRef = useRef<HTMLInputElement>(null);

  const onClickInput = () => {
    if (inputType === 'file') inputFilesRef.current?.click();
    else inputFoldersRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-10 justify-center items-center">
        <Button
          onClick={() => setInputType('file')}
          size="md"
          variant={inputType === 'file' ? 'filled' : 'outlined'}
          color="secondary"
        >
          {t('common.file')}
        </Button>
        <Button
          onClick={() => setInputType('folder')}
          size="md"
          variant={inputType === 'folder' ? 'filled' : 'outlined'}
          color="secondary"
        >
          {t('common.folder')}
        </Button>
      </div>
      <div
        className="rounded-lg border border-dashed border-(--border-color) px-8 py-12 hover:border-(--primary-hover) hover:background-opacity w-full text-(--text-primary) flex flex-col gap-5 justify-center items-center cursor-pointer"
        onClick={onClickInput}
      >
        <FontAwesomeIcon icon={faCloudArrowUp} className="text-(--text-secondary) text-4xl" />
        <input className="hidden opacity-0 fixed" ref={inputFilesRef} type="file" multiple />
        <div className="flex flex-col gap-3 justify-center items-center text-center">
          <h4 className="text-(--text-primary) text-bold text-2xl">
            {inputType === 'file' ? t('common.upload.dragAndDropFiles') : t('common.upload.dragAndDropFolders')}
          </h4>
          <p className="text-(--text-secondary)">
            {inputType === 'file' ? t('common.upload.supportMultipleFiles') : t('common.upload.supportMultipleFolders')}
          </p>
        </div>
      </div>
    </div>
  );
};
