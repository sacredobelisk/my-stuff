import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import NumberField from "~/components/number-field/number-field";
import { formatCurrency } from "~/utils/number";
import type { Person } from "./configuration/types";
import { useBillCalculator } from "./hooks/use-bill-calculator";
import { useBillCalculatorPeople } from "./hooks/use-bill-calculator-people";

export const BillCalculatorPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { addPerson, people, removePerson, setPeople, updatePerson } = useBillCalculatorPeople();
  const {
    calculatedTotal,
    calculateShare,
    finalTotal,
    handleFinalTotalChange,
    handleReset,
    handleSave,
    handleTaxChange,
    handleTipChange,
    subtotal,
    taxAmount,
    taxPercent,
    tipAmount,
    tipPercent,
  } = useBillCalculator({ people, onSave: () => setSnackbarOpen(true), setPeople });

  const columns: GridColDef<Person>[] = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 2,
        editable: true,
      },
      {
        headerName: "Subtotal",
        field: "subtotal",
        width: 100,
        editable: true,
        valueFormatter: (value) => formatCurrency(value),
      },
      {
        headerName: "Owes",
        field: "owes",
        width: 100,
        valueFormatter: (_, row) => formatCurrency(calculateShare(row.subtotal)),
      },
      {
        headerName: "",
        field: "action",
        width: 75,
        renderCell: ({ api, row }) => (
          <IconButton
            aria-label={`Remove ${row.name}`}
            color="error"
            disabled={api.getRowsCount() === 1}
            onClick={() => removePerson(row)}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        ),
      },
    ],
    [calculateShare, removePerson]
  );

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={10000}
        message="Bill saved to browser storage"
        onClose={() => setSnackbarOpen(false)}
        open={snackbarOpen}
      />

      <Stack spacing={2}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography flex="auto" variant="h2">
            Bill Calculator
            <Typography color="textSecondary">Split the bill equally by proportion, including tax and tip.</Typography>
          </Typography>

          <Box flex="none">
            <ButtonGroup>
              <Button onClick={handleSave} startIcon={<SaveIcon />} variant="contained">
                Save
              </Button>
              <Button onClick={handleReset} startIcon={<RestartAltOutlinedIcon />} variant="outlined">
                Reset
              </Button>
            </ButtonGroup>
          </Box>
        </Stack>

        <Divider />

        <DataGrid<Person>
          columns={columns}
          editMode="row"
          getRowId={(person) => person.key}
          processRowUpdate={(newRow) => {
            updatePerson(newRow);
            return newRow;
          }}
          rows={people}
          sx={{ width: "100%" }}
        />
        <Button onClick={addPerson} startIcon={<AddIcon />} style={{ width: "100%", marginTop: 16 }} variant="outlined">
          Add Person
        </Button>

        <Stack direction="row" spacing={2}>
          <Card style={{ flex: 1 }}>
            <CardHeader title="Tax & Tip" />
            <CardContent>
              <Stack spacing={0.5}>
                <Typography id="tax-slider">Tax: {taxPercent.toFixed(2)}%</Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid flex="auto">
                    <Slider
                      aria-labelledby="tax-slider"
                      max={15}
                      min={0}
                      onChange={(event, value) => handleTaxChange(value as number)}
                      step={0.25}
                      value={taxPercent}
                    />
                  </Grid>
                  <Grid flex="none">
                    <NumberField
                      aria-labelledby="tax-slider"
                      inputSx={{ width: 80 }}
                      max={100}
                      min={0}
                      onValueChange={handleTaxChange}
                      size="small"
                      step={0.01}
                      value={taxPercent}
                    />
                  </Grid>
                </Grid>
              </Stack>
              <Stack spacing={0.5}>
                <Typography id="tip-slider">Tip: {tipPercent.toFixed(2)}%</Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid flex="auto">
                    <Slider
                      aria-labelledby="tip-slider"
                      max={50}
                      min={0}
                      onChange={(event, value) => handleTipChange(value as number)}
                      step={0.25}
                      value={tipPercent}
                    />
                  </Grid>
                  <Grid flex="none">
                    <NumberField
                      aria-labelledby="tip-slider"
                      inputSx={{ width: 80 }}
                      max={100}
                      min={0}
                      onValueChange={handleTipChange}
                      size="small"
                      step={0.01}
                      value={tipPercent}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          <Card style={{ flex: 1 }}>
            <CardHeader title="Totals" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography>Subtotal:</Typography>
                </Grid>
                <Grid size={6} style={{ textAlign: "right" }}>
                  <Typography>{formatCurrency(subtotal)}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography>Tax ({taxPercent.toFixed(2)}%):</Typography>
                </Grid>
                <Grid size={6} style={{ textAlign: "right" }}>
                  <Typography>{formatCurrency(taxAmount)}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography>Tip ({tipPercent.toFixed(2)}%):</Typography>
                </Grid>
                <Grid size={6} style={{ textAlign: "right" }}>
                  <Typography>{formatCurrency(tipAmount)}</Typography>
                </Grid>

                <Grid size={12}>
                  <Divider />
                </Grid>

                <Grid size={6}>
                  <Typography id="final-total">Final Total:</Typography>
                </Grid>

                <Grid size={6} style={{ textAlign: "right" }}>
                  <NumberField
                    aria-labelledby="final-total"
                    min={0}
                    onValueChange={handleFinalTotalChange}
                    prefix="$"
                    size="small"
                    step={0.01}
                    value={finalTotal ?? calculatedTotal}
                  />
                </Grid>
              </Grid>

              <Typography color="textSecondary" sx={{ marginTop: 2 }}>
                Edit the final total to adjust tip automatically, or adjust tax/tip to calculate the total.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </>
  );
};
