import { zodiosInstance } from '@client/api/instances';
import { ZodiosHooks } from '@zodios/react';

export const zodiosHooks = new ZodiosHooks('apiHooks', zodiosInstance);
