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

export const ItemGrid = () => {
  return (
    <Link
      href="#"
      className="rounded-lg border border-(--border-color) bg-(--secondary-bg-color) p-6 cursor-pointer relative flex flex-col items-center justify-center gap-4"
    >
      <div className="absolute top-2 right-4">
        <Dropdown
          options={[
            { icon: <FontAwesomeIcon icon={faStar} />, label: 'Favorite', value: 'favorite' },
            {
              icon: <FontAwesomeIcon icon={faShareNodes} />,
              label: 'Share',
              value: 'share'
            }
          ]}
          button={{ children: <FontAwesomeIcon icon={faEllipsisVertical} /> }}
        />
      </div>
      <FontAwesomeIcon icon={iconsMap.image.icon} color={iconsMap.image.color} className="text-8xl" />
      <div className="flex flex-col">
        <p className="text-(--text-primary)">Projects</p>
        <p className="text-(--text-secondary)">4 items</p>
      </div>
    </Link>
  );
};
