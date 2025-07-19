import {
  faEllipsisVertical,
  faFileAudio,
  faFileImage,
  faFilePdf,
  faFileVideo,
  faFileZipper,
  faFolder,
  faShareNodes,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Dropdown } from '../Dropdown/Dropdown';
import { useTranslation } from 'react-i18next';

const iconsMap = {
  folder: {
    icon: faFolder,
    color: '#fbbf24'
  },
  archive: {
    icon: faFileZipper,
    color: '#a78bfa'
  },
  pdf: {
    icon: faFilePdf,
    color: '#ef4444'
  },
  image: {
    icon: faFileImage,
    color: '#f472b6'
  },
  audio: {
    icon: faFileAudio,
    color: '#34d399'
  },
  video: {
    icon: faFileVideo,
    color: '#60a5fa'
  }
};

interface Props {
  link: string;
  title: string;
  description: string;
  icon: keyof typeof iconsMap;
}

export const ItemGrid = ({ link, title, description, icon }: Props) => {
  const { t } = useTranslation();

  return (
    <Link
      href={link}
      className="rounded-lg border border-(--border-color) bg-(--secondary-bg-color) p-6 cursor-pointer relative flex flex-col items-center justify-center gap-4"
    >
      <div className="absolute top-2 right-4 min-w-4">
        <Dropdown
          options={[
            { icon: <FontAwesomeIcon icon={faStar} />, label: 'Favorite', value: 'favorite' },
            {
              icon: <FontAwesomeIcon icon={faShareNodes} />,
              label: 'Share',
              value: 'share'
            }
          ]}
          button={{
            children: <FontAwesomeIcon icon={faEllipsisVertical} scale="100%" />,
            width: 'full',
            align: 'center',
            'aria-label': t('common.selectOptions')
          }}
          size="sm"
        />
      </div>
      <FontAwesomeIcon icon={iconsMap[icon].icon} color={iconsMap[icon].color} className="text-5xl" />
      <div className="flex flex-col">
        <p className="text-(--text-primary)">{title}</p>
        <p className="text-(--text-secondary)">{description}</p>
      </div>
    </Link>
  );
};
