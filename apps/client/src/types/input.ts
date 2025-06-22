import { ImageProps } from 'next/image';

type LabelProps = {
  text: React.ReactNode | string;
  position?: 'left' | 'right' | 'bottom';
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export interface InputProps {
  label?: LabelProps;
  icon?: ImageProps | React.ReactElement;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  iconPosition?: 'left' | 'right';
  size?: '2xl' | 'xl' | 'lg';
  error?: string | boolean;
}
