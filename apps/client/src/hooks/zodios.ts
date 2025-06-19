import { zodiosInstance } from '@client/api';
import { ZodiosHooks } from '@zodios/react';

export const zodiosHooks = new ZodiosHooks('apiHooks', zodiosInstance);
