import { PropsWithChildren } from 'react';
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
  if (!open) return null;

  return (
    <div
      className="fixed w-full h-full top-0 left-0 bg-(--background-transparent) background-blur z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="flex flex-col gap-6 max-w-[500px] max-h-[80vh] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-(--text-primary)">{title}</h3>
          <FontAwesomeIcon icon={faXmark} className="text-(--text-secondary) text-2xl" onClick={onClose} />
        </div>
        {children}

        <div className="flex justify-end gap-4 pt-6 border-t-1 border-(--border-color)">
          <Button variant="outlined" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="filled" size="lg" onClick={onSuccess}>
            {successTitle}
          </Button>
        </div>
      </div>
    </div>
  );
};
