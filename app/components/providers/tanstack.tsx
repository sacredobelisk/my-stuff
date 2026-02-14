import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import type { ApiError } from "~/apis/utils/types";

const RETRYABLE_STATUS_CODES = [408, 500, 502, 503, 504];

const isRetryableError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) =>
        isRetryableError(error) && RETRYABLE_STATUS_CODES.includes(error.status) && failureCount < 3,
    },
  },
});

export const TanstackProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
