import { LocalDate, Year } from "@js-joda/core";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useBggPlaysApi } from "~/apis/bgg/use-bgg-plays-api";
import { BGG_USERNAME } from "~/apis/bgg/utils";
import { visuallyHidden } from "~/helpers/styles";

const START_YEAR = 2020;
/** Plays tracked per game — the second "10" of 10x10. */
const MAX_PLAYS = 10;
/** Games tracked — the first "10" of 10x10. */
const TOP_GAME_COUNT = 10;

const PLAY_COLUMNS = Array.from({ length: MAX_PLAYS }, (_, index) => index + 1);

export const TenByTenPage = () => {
  const [year, setYear] = useState(Year.now().value());

  const beginningOfYear = LocalDate.of(year, 1, 1);
  const endOfYear = beginningOfYear.plusYears(1).minusDays(1);

  const {
    data: plays,
    isError,
    isLoading,
    isSuccess,
  } = useBggPlaysApi({
    maxdate: endOfYear.toString(),
    mindate: beginningOfYear.toString(),
    page: "ALL",
    username: BGG_USERNAME,
  });

  const years = useMemo(
    () => Array.from({ length: Year.now().value() - START_YEAR + 1 }, (_, index) => START_YEAR + index),
    []
  );

  const topGames = useMemo(() => {
    const playsByGame = (plays ?? []).reduce<Record<string, number>>(
      (acc, play) => ({ ...acc, [play.item.name]: (acc[play.item.name] ?? 0) + play.quantity }),
      {}
    );

    return Object.entries(playsByGame)
      .map(([name, totalPlays]) => ({ name, totalPlays }))
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, TOP_GAME_COUNT);
  }, [plays]);

  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h2">
        Board Game 10x10
      </Typography>

      <ToggleButtonGroup
        aria-label="Year"
        exclusive
        onChange={(_, nextYear: number | null) => {
          if (nextYear !== null) setYear(nextYear);
        }}
        sx={{ alignSelf: "center" }}
        value={year}
      >
        {years.map((selectableYear) => (
          <ToggleButton key={selectableYear} value={selectableYear}>
            {selectableYear}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {isLoading && (
        <Stack aria-label={`Loading plays for ${year}`} role="status" spacing={1}>
          {PLAY_COLUMNS.map((placeholder) => (
            <Skeleton height={35} key={placeholder} />
          ))}
        </Stack>
      )}

      {isError && <Alert severity="error">Could not load plays from BoardGameGeek. Please try again later.</Alert>}

      {isSuccess && (
        <TableContainer component={Paper} sx={{ maxWidth: 960 }}>
          <Table size="small">
            <caption>
              Top {TOP_GAME_COUNT} Games Played in {year}
            </caption>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="col">
                  Game
                </TableCell>
                {PLAY_COLUMNS.map((count) => (
                  <TableCell align="center" component="th" key={count} scope="col">
                    {count}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {topGames.length === 0 ? (
                <TableRow>
                  <TableCell align="center" colSpan={PLAY_COLUMNS.length + 1}>
                    No games were played in {year}.
                  </TableCell>
                </TableRow>
              ) : (
                topGames.map((game) => (
                  <TableRow key={game.name}>
                    <TableCell component="th" scope="row">
                      {game.name}
                    </TableCell>
                    {PLAY_COLUMNS.map((count) => {
                      const isPlayed = count <= Math.min(game.totalPlays, MAX_PLAYS);

                      return (
                        <TableCell align="center" key={count}>
                          {isPlayed && (
                            <Box aria-hidden component="span">
                              X
                            </Box>
                          )}
                          <Box component="span" sx={visuallyHidden}>
                            {isPlayed ? "Played" : "Not played"}
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};
