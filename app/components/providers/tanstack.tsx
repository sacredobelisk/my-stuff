import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
interface MyError extends Error {
  status?: number;
}

const RETRYABLE_STATUS_CODES = [408, 500, 502, 503, 504];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: MyError) => RETRYABLE_STATUS_CODES.includes(error.status ?? 0) && failureCount < 3,
    },
  },
});

export const TanstackProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
