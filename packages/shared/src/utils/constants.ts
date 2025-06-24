import { z } from 'zod';

import { ErrorCodes } from '@shared/types';

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Zod schema for typeToFlattenedError<T, string>
const zodFlattenedErrorSchema = z.object({
  formErrors: z.array(z.string()),
  fieldErrors: z.record(z.array(z.string()))
});

export const httpErrorSchema = z.object({
  code: z.nativeEnum(ErrorCodes),
  message: z.string().or(zodFlattenedErrorSchema)
});
