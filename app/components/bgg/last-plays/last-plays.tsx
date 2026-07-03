import { LocalDate } from "@js-joda/core";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import type { BggPlay } from "~/apis/bgg/types";
import { useBggPlaysApi } from "~/apis/bgg/use-bgg-plays-api";
import { BGG_USERNAME } from "~/apis/bgg/utils";
import { MD } from "~/helpers/dates";
import { LoadingSkeleton } from "../../loading-skeleton/loading-skeleton";

const PLAY_COUNT = 5;

const playSort = (a: BggPlay, b: BggPlay) => LocalDate.parse(b.date).compareTo(LocalDate.parse(a.date));

export const LastPlays = () => {
  const oneMonthAgo = LocalDate.now().minusMonths(1);
  const {
    data: plays,
    isLoading,
    isSuccess,
  } = useBggPlaysApi({ mindate: oneMonthAgo.toString(), username: BGG_USERNAME });

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ alignItems: "center", display: "flex" }}>
            <Typography sx={{ flex: "auto" }} variant="h5">{`Last ${PLAY_COUNT} Plays`}</Typography>
            <img alt="Powered by BGG" src="/images/powered_by_BGG_01_SM.png" width="125" />
          </Box>
        }
      />
      <CardContent>
        {isLoading && <LoadingSkeleton count={PLAY_COUNT} />}

        {isSuccess && (
          <List>
            {[...plays]
              .sort(playSort)
              .slice(0, PLAY_COUNT)
              .map((play) => (
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
