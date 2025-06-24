'use client';

import { t } from 'i18next';

import { toast } from 'react-toastify';
import { ApiError } from '@client/api/openapi/requests';
import { httpErrorSchema } from '@shared/utils';

export const showApiErrors = (error: unknown) => {
  if (error instanceof ApiError) {
    const resultParse = httpErrorSchema.safeParse(error.body);

    if (resultParse.success) {
      const { message } = resultParse.data;

      if (message instanceof Object) {
        if (message.formErrors && message.formErrors.length > 0) toast.error(message.formErrors.join(', '));

        Object.entries(message.fieldErrors)
          .filter(([, errors]) => errors.length > 0)
          .forEach(([field, errors]) => {
            toast.error(`${field}: ${errors.join(', ')}`);
          });
      } else toast.error(message);
    } else toast.error(t('errors.somethingWentWrong'));
  }
};
