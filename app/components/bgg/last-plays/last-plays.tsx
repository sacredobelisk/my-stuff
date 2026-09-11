import { LocalDate } from "@js-joda/core";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import type { BggPlay } from "~/apis/bgg/types";
import { useBggPlaysApi } from "~/apis/bgg/use-bgg-plays-api";
import { BGG_USERNAME } from "~/apis/bgg/utils";
import { MD } from "~/helpers/dates";

const PLAY_COUNT = 5;
const SKELETON_ROWS = Array.from({ length: PLAY_COUNT }, (_, index) => index);

const byMostRecent = (a: BggPlay, b: BggPlay) => LocalDate.parse(b.date).compareTo(LocalDate.parse(a.date));

export const LastPlays = () => {
  // Pinned for the lifetime of the component so the query key does not change underneath us.
  const oneMonthAgo = useMemo(() => LocalDate.now().minusMonths(1).toString(), []);

  const {
    data: plays,
    isError,
    isLoading,
    isSuccess,
  } = useBggPlaysApi({ mindate: oneMonthAgo, username: BGG_USERNAME });

  const recentPlays = useMemo(() => [...(plays ?? [])].sort(byMostRecent).slice(0, PLAY_COUNT), [plays]);

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ alignItems: "center", display: "flex" }}>
            <Typography component="h2" sx={{ flex: "auto" }} variant="h5">{`Last ${PLAY_COUNT} Plays`}</Typography>
            <img alt="Powered by BGG" src="/images/powered_by_BGG_01_SM.png" width="125" />
          </Box>
        }
      />
      <CardContent>
        {isLoading && (
          <Box aria-label="Loading recent plays" role="status">
            {SKELETON_ROWS.map((row) => (
              <Skeleton height={35} key={row} />
            ))}
          </Box>
        )}

        {isError && <Alert severity="error">Could not load recent plays from BoardGameGeek.</Alert>}

        {isSuccess && recentPlays.length === 0 && (
          <Typography color="textSecondary">No plays recorded in the last month.</Typography>
        )}

        {isSuccess && recentPlays.length > 0 && (
          <List>
            {recentPlays.map((play) => (
              <ListItem key={play.id} sx={{ display: "flex" }}>
                <Typography sx={{ flex: "auto", fontWeight: "bold" }}>{play.item.name}</Typography>
                <Typography>{LocalDate.parse(play.date).format(MD)}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
