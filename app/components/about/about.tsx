import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LastPlays } from "~/components/bgg/last-plays/last-plays";

export const AboutPage = () => (
  <Stack spacing={2}>
    <Typography component="h1" variant="h2">
      About
    </Typography>

    <Typography>
      Hi! I&apos;m Sean OBrien, a software engineer based outside of Philadelphia. I specialize in creating web
      applications using modern technologies like React, JavaScript, and TypeScript.
    </Typography>

    <LastPlays />
  </Stack>
);
