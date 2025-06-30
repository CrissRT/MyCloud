// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { LoginService, RegisterService } from '../requests/services.gen';
import * as Common from './common';
export const useRegisterServicePostAuthRegister = <
  TData = Common.RegisterServicePostAuthRegisterMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody?: {
          email: string;
          password: string;
          firstName: string;
          lastName: string;
          sex: 'male' | 'female' | 'other';
          birthDate: string;
        };
      },
      TContext
    >,
    'mutationFn'
  >
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody?: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        sex: 'male' | 'female' | 'other';
        birthDate: string;
      };
    },
    TContext
  >({
    mutationFn: ({ requestBody }) => RegisterService.postAuthRegister({ requestBody }) as unknown as Promise<TData>,
    ...options
  });
export const useLoginServicePostAuthLogin = <
  TData = Common.LoginServicePostAuthLoginMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody?: { email: string; password: string };
      },
      TContext
    >,
    'mutationFn'
  >
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody?: { email: string; password: string };
    },
    TContext
  >({
    mutationFn: ({ requestBody }) => LoginService.postAuthLogin({ requestBody }) as unknown as Promise<TData>,
    ...options
  });
