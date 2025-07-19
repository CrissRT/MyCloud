// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { MeService } from "../requests/services.gen";
import * as Common from "./common";
export const ensureUseMeServiceGetAccountMeData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMeServiceGetAccountMeKeyFn(), queryFn: () => MeService.getAccountMe() });
