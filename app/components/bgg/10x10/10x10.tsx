import { LocalDate, Year } from "@js-joda/core";
import {
  Button,
  ButtonGroup,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useBggPlaysApi } from "~/apis/bgg/use-bgg-plays-api";

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
        {Array(Year.now().value() - 2020 + 1)
          .fill(0)
          .map((_, index) => (
            <Button
              key={index}
              onClick={() => setYear(2020 + index)}
              variant={year === 2020 + index ? "contained" : "outlined"}
            >
              {2020 + index}
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
              {topTenPlays.map((entry) => (
                <TableRow key={entry.name}>
                  <TableCell>{entry.name}</TableCell>
                  {playColumns.map((count) => (
                    <TableCell align="center" key={`${entry.name}-${count}`}>
                      {count <= Math.min(entry.totalPlays, MAX_PLAYS) ? "X" : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};
