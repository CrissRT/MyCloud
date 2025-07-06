import { ImageProps } from 'next/image';

import { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, PropsWithChildren } from 'react';

export const getAPIBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');

  return baseUrl;
};

export const getGoogleSSOClientId = () => {
  const clientId = process.env.NEXT_PUBLIC_SSO_GOOGLE;
  if (!clientId) throw new Error('NEXT_PUBLIC_SSO_GOOGLE is not defined');

  return clientId;
};

export type PromiseLanguage = Promise<{ lng: string }>;

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

type LabelProps = {
  text: React.ReactNode | string;
  position?: 'left' | 'right' | 'bottom';
} & LabelHTMLAttributes<HTMLLabelElement>;

export interface InputProps {
  label?: LabelProps;
  icon?: ImageProps | React.ReactElement;
  input?: InputHTMLAttributes<HTMLInputElement>;
  iconPosition?: 'left' | 'right';
  size?: Sizes;
  error?: string | boolean;
}

export type Sizes = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonProps = {
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'error' | 'secondary';
  width?: 'full';
  align?: 'left' | 'center' | 'right';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
} & PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement>;
