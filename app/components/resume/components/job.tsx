import type { LocalDate } from "@js-joda/core";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PropsWithChildren, ReactNode } from "react";
import { MY } from "~/helpers/dates";

type Props = PropsWithChildren<{
  company?: ReactNode;
  dates: { end?: LocalDate; start: LocalDate };
  location?: ReactNode;
  title: ReactNode;
}>;

export const Job = ({ children, company, dates, location, title }: Props) => (
  <Stack spacing={0.5}>
    <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
      <Typography sx={{ flex: "auto" }} variant="h3">
        {title}
      </Typography>
      <Typography>
        {dates.start.format(MY)} - {dates.end ? dates.end?.format(MY) : "Present"}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
      {company && <Typography sx={{ flex: "auto", fontStyle: "italic" }}>{company}</Typography>}
      {location && <Typography>{location}</Typography>}
    </Box>

    {children}
  </Stack>
);
