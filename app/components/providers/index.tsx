import { type PropsWithChildren } from "react";
import { CustomThemeProvider } from "./custom-theme";
import { TanstackProvider } from "./tanstack";

export const GlobalProviders = ({ children }: PropsWithChildren) => {
  return (
    <CustomThemeProvider>
      <TanstackProvider>{children}</TanstackProvider>
    </CustomThemeProvider>
  );
};
