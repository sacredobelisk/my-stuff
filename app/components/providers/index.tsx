import type { PropsWithChildren } from "react";
import { CustomThemeProvider } from "~/components/providers/custom-theme";
import { TanstackProvider } from "~/components/providers/tanstack";

export const GlobalProviders = ({ children }: PropsWithChildren) => (
  <CustomThemeProvider>
    <TanstackProvider>{children}</TanstackProvider>
  </CustomThemeProvider>
);
