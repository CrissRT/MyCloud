'use client';

import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@client/components';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props extends PropsWithChildren {
  title: string;
  onClose: () => void;
  successTitle: string;
  open: boolean;
  onSuccess: () => void;
}

export const Modal = ({ open, title, onClose, successTitle, onSuccess, children }: Props) => {
  const { t } = useTranslation();

  if (!open) return null;

  const onCloseBackground = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed w-full h-full top-0 left-0 bg-(--background-transparent) background-blur z-50 flex items-center justify-center"
      onClick={onCloseBackground}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${title}`}
    >
      <div className="flex flex-col gap-6 max-w-[500px] max-h-[80vh] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-(--text-primary) font-bold text-2xl">{title}</h3>
          <Button variant="text" onClick={onClose} aria-label={t('common.cancel')} color="secondary" size="lg">
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        {children}

        <div className="flex justify-end gap-4 pt-6 border-t-1 border-(--border-color)">
          <Button variant="outlined" size="lg" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="filled" size="lg" onClick={onSuccess}>
            {successTitle}
          </Button>
        </div>
      </div>
    </div>
  );
};
