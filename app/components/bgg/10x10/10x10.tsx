import { LocalDate, Year } from "@js-joda/core";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMemo, useState } from "react";
import { useBggPlaysApi } from "~/apis/bgg/use-bgg-plays-api";
import { BGG_USERNAME } from "~/apis/bgg/utils";
import { LoadingSkeleton } from "../../loading-skeleton/loading-skeleton";

const START_YEAR = 2020;
const MAX_PLAYS = 10;

export const TenByTenPage = () => {
  const [year, setYear] = useState(Year.now().value());

  const beginningOfYear = LocalDate.of(year, 1, 1);
  const endOfYear = beginningOfYear.plusYears(1).minusDays(1);
  const {
    data: plays,
    isLoading,
    isSuccess,
  } = useBggPlaysApi({
    mindate: beginningOfYear.toString(),
    maxdate: endOfYear.toString(),
    page: "ALL",
    username: BGG_USERNAME,
  });

  const topTenPlays = useMemo(() => {
    const aggPlays = plays?.reduce(
      (acc, play) => {
        if (!acc[play.item.name]) {
          acc[play.item.name] = 0;
        }
        acc[play.item.name] += play.quantity;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(aggPlays ?? {})
      .map(([name, totalPlays]) => ({
        name,
        totalPlays,
      }))
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, 10);
  }, [plays]);

  const playColumns = useMemo(() => Array.from({ length: MAX_PLAYS }, (_, index) => index + 1), []);
  const years = Array.from({ length: Year.now().value() - START_YEAR + 1 }, (_, index) => START_YEAR + index);

  return (
    <Stack spacing={2}>
      <Typography variant="h2">Board Game 10x10</Typography>

      <ButtonGroup aria-label="Years" variant="outlined" sx={{ alignSelf: "center" }}>
        {years.map((yearOption) => (
          <Button
            aria-pressed={year === yearOption}
            key={yearOption}
            onClick={() => setYear(yearOption)}
            variant={year === yearOption ? "contained" : "outlined"}
          >
            {yearOption}
          </Button>
        ))}
      </ButtonGroup>

      {isLoading && <LoadingSkeleton count={MAX_PLAYS} />}

      {isSuccess && (
        <TableContainer component={Paper} sx={{ maxWidth: 960 }}>
          <Table size="small">
            <caption>Top 10 Games Played in {year}</caption>
            <TableHead>
              <TableRow>
                <TableCell>Game</TableCell>
                {playColumns.map((count) => (
                  <TableCell align="center" key={count}>
                    {count}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {topTenPlays.length === 0 ? (
                <TableRow>
                  <TableCell align="center" colSpan={playColumns.length + 1}>
                    No games were played in {year}.
                  </TableCell>
                </TableRow>
              ) : (
                topTenPlays.map((entry) => (
                  <TableRow key={entry.name}>
                    <TableCell component="th" scope="row">
                      {entry.name}
                    </TableCell>
                    {playColumns.map((count) => (
                      <TableCell align="center" key={`${entry.name}-${count}`}>
                        {count <= Math.min(entry.totalPlays, MAX_PLAYS) ? "X" : ""}
                      </TableCell>
                    ))}
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
