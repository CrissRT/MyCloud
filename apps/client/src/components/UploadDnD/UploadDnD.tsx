'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@client/components';
import { iconsMap } from '@client/utils';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Extend HTMLInputElement to include webkitdirectory
interface HTMLInputElementWithWebkitDirectory
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'webkitdirectory'> {
  webkitdirectory?: boolean;
}

const getFileIconByMime = (mime: string | undefined) => {
  if (!mime) return iconsMap.default;

  const [type, subtype] = mime.split('/');
  switch (type) {
    case 'image':
      return iconsMap.image;
    case 'audio':
      return iconsMap.audio;
    case 'video':
      return iconsMap.video;
    case 'text':
      return iconsMap.text;
    case 'application':
      if (subtype === 'pdf') return iconsMap.pdf;
      if (/(zip|gzip|x-.*compress|x-tar|x-rar|x-7z-compressed|x-freearc)/.test(subtype)) {
        return iconsMap.archive;
      }
      break;
    default:
      break;
  }
  return iconsMap.default;
};

const getFolderStructure = (files: File[]) => {
  const folders = new Set<string>();
  files.forEach((file) => {
    const pathParts = file.webkitRelativePath.split('/');
    if (file.webkitRelativePath && pathParts.length > 1) folders.add(pathParts[0]);
  });
  return Array.from(folders);
};

export const UploadDnD = () => {
  const { t } = useTranslation();
  const [inputType, setInputType] = useState<'file' | 'folder'>('file');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setFiles([]);
  }, [inputType]);

  const inputFilesRef = useRef<HTMLInputElement>(null);
  const inputFoldersRef = useRef<HTMLInputElement>(null);

  const onClickInput = () => {
    if (inputType === 'file') inputFilesRef.current?.click();
    else inputFoldersRef.current?.click();
  };

  const onChangeFilesInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles((prevState) => [...prevState, ...Array.from(event.target.files!)]);
    }
  };

  const onChangeFoldersInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prevState) => [...prevState, ...Array.from(event.target.files!)]);
    }
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
        <input
          className="hidden opacity-0 fixed"
          ref={inputFilesRef}
          type="file"
          multiple
          onChange={onChangeFilesInput}
        />
        <input
          className="hidden opacity-0 fixed"
          ref={inputFoldersRef}
          type="file"
          {...({ webkitdirectory: true } satisfies HTMLInputElementWithWebkitDirectory)}
          onChange={onChangeFoldersInput}
          multiple
        />
        <div className="flex flex-col gap-3 justify-center items-center text-center">
          <h4 className="text-(--text-primary) text-bold text-2xl">
            {inputType === 'file' ? t('common.upload.dragAndDropFiles') : t('common.upload.dragAndDropFolders')}
          </h4>
          <p className="text-(--text-secondary)">
            {inputType === 'file' ? t('common.upload.supportMultipleFiles') : t('common.upload.supportOneFolder')}
          </p>
        </div>
      </div>

      <h4 className="font-bold">
        {inputType === 'file' ? t('common.upload.selectedFiles') : t('common.upload.selectedFolders')}
      </h4>

      <div className="flex flex-col gap-4">
        {inputType === 'file' ? (
          files.map((file, index) => {
            const fileIcon = getFileIconByMime(file.type);
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 border border-(--border-color) rounded-lg"
              >
                <FontAwesomeIcon icon={fileIcon.icon} className="text-lg" style={{ color: fileIcon.color }} />
                <div className="flex flex-col">
                  <span className="text-(--text-primary) font-medium">{file.name}</span>
                  <span className="text-(--text-secondary) text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            );
          })
        ) : (
          <>
            {getFolderStructure(files).map((folderName, index) => (
              <div
                key={`${folderName}-${index}`}
                className="flex items-center gap-3 p-3 border border-(--border-color) rounded-lg"
              >
                <FontAwesomeIcon
                  icon={iconsMap.folder.icon}
                  className="text-lg"
                  style={{ color: iconsMap.folder.color }}
                />
                <div className="flex flex-col">
                  <span className="text-(--text-primary) font-medium">{folderName}</span>
                  <span className="text-(--text-secondary) text-sm">
                    {files.filter((f) => f.webkitRelativePath?.startsWith(folderName + '/')).length} files
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
