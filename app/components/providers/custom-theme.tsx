import { ThemeProvider, createTheme } from "@mui/material/styles";
import { type PropsWithChildren } from "react";

const theme = createTheme({
  typography: {
    h1: {
      fontSize: "2.25rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
  },
});

export const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
