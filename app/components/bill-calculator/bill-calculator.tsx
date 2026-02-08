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
import { formatCurrency } from "~/helpers/numbers";
import type { Person } from "./configuration/types";
import { useBillCalculator } from "./hooks/use-bill-calculator";
import { useBillCalculatorPeople } from "./hooks/use-bill-calculator-people";

export const BillCalculatorPage = () => {
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState<string | null>();
  const [savedSnackbarOpen, setSavedSnackbarOpen] = useState(false);

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
  } = useBillCalculator({ people, onSave: () => setSavedSnackbarOpen(true), setPeople });

  const columns: GridColDef<Person>[] = useMemo(
    () => [
      {
        editable: true,
        field: "name",
        flex: 2,
        headerName: "Name",
      },
      {
        editable: true,
        field: "subtotal",
        headerName: "Subtotal",
        preProcessEditCellProps: (params) => {
          const value = parseFloat(params.props.value);
          const isValid = !isNaN(value) && value >= 0;
          setErrorSnackbarMessage("Please enter a valid non-negative number for subtotal.");
          return { ...params.props, error: !isValid };
        },
        width: 100,
        valueFormatter: (value) => formatCurrency(value),
      },
      {
        field: "owes",
        headerName: "Owes",
        valueFormatter: (_, row) => formatCurrency(calculateShare(row.subtotal)),
        width: 100,
      },
      {
        field: "action",
        headerName: "Actions",
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
        width: 75,
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
        onClose={() => setSavedSnackbarOpen(false)}
        open={savedSnackbarOpen}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={errorSnackbarMessage}
        onClose={() => setErrorSnackbarMessage(null)}
        open={!!errorSnackbarMessage}
      />

      <Stack spacing={2}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography sx={{ flex: "auto" }} variant="h2">
            Bill Calculator
            <Typography color="textSecondary">Split the bill equally by proportion, including tax and tip.</Typography>
          </Typography>

          <Box sx={{ flex: "none" }}>
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
          onProcessRowUpdateError={() => {
            setErrorSnackbarMessage("Error updating row. Please check your input.");
          }}
          rows={people}
          sx={{ width: "100%" }}
        />
        <Button onClick={addPerson} startIcon={<AddIcon />} sx={{ width: "100%", mt: 2 }} variant="outlined">
          Add Person
        </Button>

        <Stack direction="row" spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardHeader title="Tax & Tip" />
            <CardContent>
              <Stack spacing={0.5}>
                <Typography id="tax-slider">Tax: {taxPercent.toFixed(2)}%</Typography>

                <Grid container alignItems="center" spacing={2}>
                  <Grid size="grow">
                    <Slider
                      aria-labelledby="tax-slider"
                      max={15}
                      min={0}
                      onChange={(event, value) => handleTaxChange(value as number)}
                      step={0.25}
                      value={taxPercent}
                    />
                  </Grid>
                  <Grid>
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

                <Grid container alignItems="center" spacing={2}>
                  <Grid size="grow">
                    <Slider
                      aria-labelledby="tip-slider"
                      max={50}
                      min={0}
                      onChange={(event, value) => handleTipChange(value as number)}
                      step={0.25}
                      value={tipPercent}
                    />
                  </Grid>
                  <Grid>
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

          <Card sx={{ flex: 1 }}>
            <CardHeader title="Totals" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography>Subtotal:</Typography>
                </Grid>
                <Grid size={6} sx={{ textAlign: "right" }}>
                  <Typography>{formatCurrency(subtotal)}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography>Tax ({taxPercent.toFixed(2)}%):</Typography>
                </Grid>
                <Grid size={6} sx={{ textAlign: "right" }}>
                  <Typography>{formatCurrency(taxAmount)}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography>Tip ({tipPercent.toFixed(2)}%):</Typography>
                </Grid>
                <Grid size={6} sx={{ textAlign: "right" }}>
                  <Typography>{formatCurrency(tipAmount)}</Typography>
                </Grid>

                <Grid size={12}>
                  <Divider />
                </Grid>

                <Grid size={6}>
                  <Typography id="final-total">Final Total:</Typography>
                </Grid>

                <Grid size={6} sx={{ textAlign: "right" }}>
                  <NumberField
                    aria-labelledby="final-total"
                    min={0}
                    onValueChange={handleFinalTotalChange}
                    size="small"
                    step={0.01}
                    value={finalTotal ?? calculatedTotal}
                  />
                </Grid>
              </Grid>

              <Typography color="textSecondary" sx={{ mt: 2 }}>
                Edit the final total to adjust tip automatically, or adjust tax/tip to calculate the total.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </>
  );
};
