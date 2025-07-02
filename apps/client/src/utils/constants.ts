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
