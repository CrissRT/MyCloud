// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { ForgotPasswordService, GoogleService, LoginService, MeService, PreferencesService, RegisterService, ResetPasswordService } from "../requests/services.gen";
import * as Common from "./common";
export const useMeServiceGetAccountMe = <TData = Common.MeServiceGetAccountMeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMeServiceGetAccountMeKeyFn(queryKey), queryFn: () => MeService.getAccountMe() as TData, ...options });
export const useRegisterServicePostAuthRegister = <TData = Common.RegisterServicePostAuthRegisterMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { email: string; password: string; firstName: string; lastName: string; sex: "male" | "female" | "other"; birthDate: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { email: string; password: string; firstName: string; lastName: string; sex: "male" | "female" | "other"; birthDate: string; };
}, TContext>({ mutationFn: ({ requestBody }) => RegisterService.postAuthRegister({ requestBody }) as unknown as Promise<TData>, ...options });
export const useLoginServicePostAuthLogin = <TData = Common.LoginServicePostAuthLoginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { email: string; password: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { email: string; password: string; };
}, TContext>({ mutationFn: ({ requestBody }) => LoginService.postAuthLogin({ requestBody }) as unknown as Promise<TData>, ...options });
export const useForgotPasswordServicePostAuthForgotPassword = <TData = Common.ForgotPasswordServicePostAuthForgotPasswordMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { email: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { email: string; };
}, TContext>({ mutationFn: ({ requestBody }) => ForgotPasswordService.postAuthForgotPassword({ requestBody }) as unknown as Promise<TData>, ...options });
export const useResetPasswordServicePostAuthResetPassword = <TData = Common.ResetPasswordServicePostAuthResetPasswordMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { token: string; password: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { token: string; password: string; };
}, TContext>({ mutationFn: ({ requestBody }) => ResetPasswordService.postAuthResetPassword({ requestBody }) as unknown as Promise<TData>, ...options });
export const useGoogleServicePostAuthGoogle = <TData = Common.GoogleServicePostAuthGoogleMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { credential: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { credential: string; };
}, TContext>({ mutationFn: ({ requestBody }) => GoogleService.postAuthGoogle({ requestBody }) as unknown as Promise<TData>, ...options });
export const usePreferencesServicePatchAccountPreferences = <TData = Common.PreferencesServicePatchAccountPreferencesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => PreferencesService.patchAccountPreferences() as unknown as Promise<TData>, ...options });
