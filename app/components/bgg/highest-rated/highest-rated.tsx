import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useBggCollectionApi } from "../../../apis/bgg/use-bgg-collection-api";

const PLAY_COUNT = 5;

export const HighestRated = () => {
  const {
    data: rated9s,
    isLoading: isLoadingRated9s,
    isSuccess: isSuccessRated9s,
  } = useBggCollectionApi({ minrating: 9, rating: 9, username: "sobrien79" }, { enabled: false });
  const {
    data: rated10s,
    isLoading: isLoadingRated10s,
    isSuccess: isSuccessRated10s,
  } = useBggCollectionApi({ minrating: 10, rating: 10, username: "sobrien79" }, { enabled: false });

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ alignItems: "center", display: "flex" }}>
            <Typography sx={{ flex: "auto" }} variant="h5">
              Highest Rated
            </Typography>
            <img alt="Powered by BGG" src="/images/powered_by_BGG_01_SM.png" width="125" />
          </Box>
        }
      />
      <CardContent>
        {isLoadingRated9s || isLoadingRated10s
          ? Array(PLAY_COUNT)
              .fill(0)
              .map((_, index) => <Skeleton height={35} key={index} />)
          : null}
        {isSuccessRated9s && isSuccessRated10s && (
          <List>
            {[...rated10s, ...rated9s].map((item) => (
              <ListItem key={item.collid} sx={{ display: "flex" }}>
                <Typography sx={{ flex: "auto", fontWeight: "bold" }}>{item.name["#text"]}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
