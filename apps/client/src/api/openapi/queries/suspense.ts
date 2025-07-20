// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { MeService } from '../requests/services.gen';
import * as Common from './common';
export const useMeServiceGetAccountMeSuspense = <
  TData = Common.MeServiceGetAccountMeDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseMeServiceGetAccountMeKeyFn(queryKey),
    queryFn: () => MeService.getAccountMe() as TData,
    ...options
  });
