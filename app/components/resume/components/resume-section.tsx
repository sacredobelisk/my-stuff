import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
}>;

export const ResumeSection = ({ title, children }: Props) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h2" sx={{ borderBottom: 1, textTransform: "uppercase", width: "100%" }}>
        {title}
      </Typography>

      {children}
    </Stack>
  );
};
