import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import { HighestRated } from "../bgg/highest-rated/highest-rated";
import { LastPlays } from "../bgg/last-plays/last-plays";

export function AboutPage() {
  return (
    <Stack spacing={2}>
      <Typography>
        Hi! I&apos;m Sean OBrien, a software engineer based outside of Philadelphia. I specialize in creating web
        applications using modern technologies like React, JavaScript, and TypeScript.
      </Typography>

      <LastPlays />
      {/* <HighestRated /> */}
    </Stack>
  );
}
