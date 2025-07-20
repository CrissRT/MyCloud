// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { ForgotPasswordService, GoogleService, LoginService, MeService, PreferencesService, RegisterService, ResetPasswordService } from "../requests/services.gen";
export type MeServiceGetAccountMeDefaultResponse = Awaited<ReturnType<typeof MeService.getAccountMe>>;
export type MeServiceGetAccountMeQueryResult<TData = MeServiceGetAccountMeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMeServiceGetAccountMeKey = "MeServiceGetAccountMe";
export const UseMeServiceGetAccountMeKeyFn = (queryKey?: Array<unknown>) => [useMeServiceGetAccountMeKey, ...(queryKey ?? [])];
export type RegisterServicePostAuthRegisterMutationResult = Awaited<ReturnType<typeof RegisterService.postAuthRegister>>;
export type LoginServicePostAuthLoginMutationResult = Awaited<ReturnType<typeof LoginService.postAuthLogin>>;
export type ForgotPasswordServicePostAuthForgotPasswordMutationResult = Awaited<ReturnType<typeof ForgotPasswordService.postAuthForgotPassword>>;
export type ResetPasswordServicePostAuthResetPasswordMutationResult = Awaited<ReturnType<typeof ResetPasswordService.postAuthResetPassword>>;
export type GoogleServicePostAuthGoogleMutationResult = Awaited<ReturnType<typeof GoogleService.postAuthGoogle>>;
export type PreferencesServicePatchAccountPreferencesMutationResult = Awaited<ReturnType<typeof PreferencesService.patchAccountPreferences>>;
