import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import type { ApiError } from "~/apis/utils/types";

const MAX_QUERY_RETRIES = 3;
const RETRYABLE_STATUS_CODES = [408, 500, 502, 503, 504];

const isApiError = (error: unknown): error is ApiError =>
  typeof error === "object" && error !== null && "status" in error && typeof (error as ApiError).status === "number";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) =>
        isApiError(error) && RETRYABLE_STATUS_CODES.includes(error.status) && failureCount < MAX_QUERY_RETRIES,
    },
  },
});

export const TanstackProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
