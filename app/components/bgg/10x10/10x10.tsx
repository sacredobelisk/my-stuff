import { LocalDate, Year } from "@js-joda/core";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMemo, useState } from "react";
import { useBggPlaysApi } from "~/apis/bgg/use-bgg-plays-api";

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
    username: "sobrien79",
  });

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

  const topTenPlays = useMemo(
    () =>
      Object.entries(aggPlays ?? {})
        .map(([name, totalPlays]) => ({
          name,
          totalPlays,
        }))
        .sort((a, b) => b.totalPlays - a.totalPlays)
        .slice(0, 10),
    [aggPlays]
  );

  const playColumns = useMemo(() => Array.from({ length: MAX_PLAYS }, (_, index) => index + 1), []);

  return (
    <Stack spacing={2}>
      <ButtonGroup aria-label="Years" variant="outlined" sx={{ alignSelf: "center" }}>
        {Array(Year.now().value() - START_YEAR + 1)
          .fill(0)
          .map((_, index) => (
            <Button
              key={index}
              onClick={() => setYear(START_YEAR + index)}
              variant={year === START_YEAR + index ? "contained" : "outlined"}
            >
              {START_YEAR + index}
            </Button>
          ))}
      </ButtonGroup>
      {isLoading &&
        Array(MAX_PLAYS)
          .fill(0)
          .map((_, index) => <Skeleton height={35} key={index} />)}
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
                    <TableCell>{entry.name}</TableCell>
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
