import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
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
import type { Person } from "~/components/bill-calculator/configuration/types";
import { useBillCalculator } from "~/components/bill-calculator/hooks/use-bill-calculator";
import { NumberField } from "~/components/number-field/number-field";
import { formatCurrency } from "~/helpers/numbers";

const MAX_PERCENT = 100;
const MAX_TAX_SLIDER_PERCENT = 15;
const MAX_TIP_SLIDER_PERCENT = 50;
const PERCENT_STEP = 0.25;
const SNACKBAR_AUTO_HIDE_MS = 6000;

interface PercentControlProps {
  /** Id of the visible label both the slider and the number field are named by. */
  labelId: string;
  label: string;
  onChange: (value: number | null) => void;
  sliderMax: number;
  value: number;
}

const PercentControl = ({ label, labelId, onChange, sliderMax, value }: PercentControlProps) => (
  <Stack spacing={0.5}>
    <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
      <Typography id={labelId} sx={{ flex: "auto" }}>
        {label}
      </Typography>
      {/* Both controls announce the value themselves, so this readout is decoration. */}
      <Typography aria-hidden color="textSecondary">
        {value.toFixed(2)}%
      </Typography>
    </Stack>

    <Grid container spacing={2} sx={{ alignItems: "center" }}>
      <Grid size="grow">
        <Slider
          aria-labelledby={labelId}
          max={sliderMax}
          min={0}
          onChange={(_, sliderValue) => onChange(sliderValue as number)}
          step={PERCENT_STEP}
          value={Math.min(value, sliderMax)}
        />
      </Grid>
      <Grid>
        <NumberField
          aria-labelledby={labelId}
          inputSx={{ width: 80 }}
          max={MAX_PERCENT}
          min={0}
          onValueChange={onChange}
          size="small"
          step={0.01}
          value={value}
        />
      </Grid>
    </Grid>
  </Stack>
);

export const BillCalculatorPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavedMessageOpen, setIsSavedMessageOpen] = useState(false);

  const {
    finalTotal,
    handleAddPerson,
    handleFinalTotalChange,
    handleRemovePerson,
    handleReset,
    handleSave,
    handleTaxChange,
    handleTipChange,
    handleUpdatePerson,
    people,
    shares,
    subtotal,
    taxAmount,
    taxPercent,
    tipAmount,
    tipPercent,
  } = useBillCalculator({ onSave: () => setIsSavedMessageOpen(true) });

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
          const value = Number(params.props.value);
          const isValid = params.props.value !== "" && !Number.isNaN(value) && value >= 0;

          if (!isValid) setErrorMessage("Please enter a valid non-negative number for subtotal.");

          return { ...params.props, error: !isValid };
        },
        valueFormatter: (value: number) => formatCurrency(value),
        width: 100,
      },
      {
        field: "owes",
        headerName: "Owes",
        // Sorting and filtering read the value, so the share has to come from a getter, not a formatter.
        valueGetter: (_, row) => shares[row.key] ?? 0,
        valueFormatter: (value: number) => formatCurrency(value),
        width: 100,
      },
      {
        disableColumnMenu: true,
        field: "action",
        filterable: false,
        headerName: "Actions",
        renderCell: ({ row }) => (
          <IconButton
            aria-label={`Remove ${row.name || "unnamed person"}`}
            color="error"
            disabled={people.length === 1}
            onClick={() => handleRemovePerson(row)}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        ),
        sortable: false,
        width: 75,
      },
    ],
    [handleRemovePerson, people.length, shares]
  );

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={SNACKBAR_AUTO_HIDE_MS}
        onClose={() => setIsSavedMessageOpen(false)}
        open={isSavedMessageOpen}
      >
        <Alert onClose={() => setIsSavedMessageOpen(false)} severity="success" variant="filled">
          Bill saved to browser storage
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        autoHideDuration={SNACKBAR_AUTO_HIDE_MS}
        onClose={() => setErrorMessage(null)}
        open={!!errorMessage}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box sx={{ flex: "auto" }}>
            <Typography component="h1" variant="h2">
              Bill Calculator
            </Typography>
            <Typography color="textSecondary">Split the bill equally by proportion, including tax and tip.</Typography>
          </Box>

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
          aria-label="People on the bill and what each one owes"
          columns={columns}
          editMode="row"
          getRowId={(person) => person.key}
          hideFooter
          onProcessRowUpdateError={() => setErrorMessage("Error updating row. Please check your input.")}
          processRowUpdate={(newRow) => {
            handleUpdatePerson(newRow);
            return newRow;
          }}
          rows={people}
          sx={{ width: "100%" }}
        />
        <Button onClick={handleAddPerson} startIcon={<AddIcon />} sx={{ width: "100%" }} variant="outlined">
          Add Person
        </Button>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardHeader title="Tax & Tip" />
            <CardContent>
              <Stack spacing={2}>
                <PercentControl
                  label="Tax"
                  labelId="tax-label"
                  onChange={handleTaxChange}
                  sliderMax={MAX_TAX_SLIDER_PERCENT}
                  value={taxPercent}
                />
                <PercentControl
                  label="Tip"
                  labelId="tip-label"
                  onChange={handleTipChange}
                  sliderMax={MAX_TIP_SLIDER_PERCENT}
                  value={tipPercent}
                />
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
                  <Typography id="final-total-label">Final Total:</Typography>
                </Grid>

                <Grid size={6} sx={{ textAlign: "right" }}>
                  <NumberField
                    aria-labelledby="final-total-label"
                    min={0}
                    onValueChange={handleFinalTotalChange}
                    size="small"
                    step={0.01}
                    value={finalTotal}
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
