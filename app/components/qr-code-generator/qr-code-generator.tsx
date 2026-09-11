import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { QRCodeCanvas } from "qrcode.react";
import NumberField from "~/components/number-field/number-field";
import type { QrCodeErrorCorrectionLevel } from "./configuration/types";
import { MAX_QR_CODE_SIZE, MIN_QR_CODE_SIZE } from "./configuration/utils";
import { useQrCodeGenerator } from "./hooks/use-qr-code-generator";

const ERROR_CORRECTION_LEVELS: { label: string; value: QrCodeErrorCorrectionLevel }[] = [
  { label: "Low", value: "L" },
  { label: "Medium", value: "M" },
  { label: "Quartile", value: "Q" },
  { label: "High", value: "H" },
];

export const QrCodeGeneratorPage = () => {
  const {
    canvasRef,
    errorCorrectionLevel,
    handleDownload,
    handleErrorCorrectionLevelChange,
    handleReset,
    handleSizeChange,
    handleValueChange,
    size,
    value,
  } = useQrCodeGenerator();

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Typography sx={{ flex: "auto" }} variant="h2">
          QR Code Generator
          <Typography color="textSecondary">Generate a downloadable QR code from any text or URL.</Typography>
        </Typography>

        <Box sx={{ flex: "none" }}>
          <ButtonGroup>
            <Button
              disabled={!value}
              onClick={handleDownload}
              startIcon={<FileDownloadOutlinedIcon />}
              variant="contained"
            >
              Download
            </Button>
            <Button onClick={handleReset} startIcon={<RestartAltOutlinedIcon />} variant="outlined">
              Reset
            </Button>
          </ButtonGroup>
        </Box>
      </Stack>

      <Divider />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardHeader title="Content" />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Text or URL"
                minRows={3}
                multiline
                onChange={(event) => handleValueChange(event.target.value)}
                placeholder="https://example.com"
                value={value}
              />

              <Stack spacing={0.5}>
                <Typography id="size-slider">Size: {size}px</Typography>

                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid size="grow">
                    <Slider
                      aria-labelledby="size-slider"
                      max={MAX_QR_CODE_SIZE}
                      min={MIN_QR_CODE_SIZE}
                      onChange={(event, newSize) => handleSizeChange(newSize as number)}
                      step={8}
                      value={size}
                    />
                  </Grid>
                  <Grid>
                    <NumberField
                      aria-labelledby="size-slider"
                      inputSx={{ width: 90 }}
                      max={MAX_QR_CODE_SIZE}
                      min={MIN_QR_CODE_SIZE}
                      onValueChange={(newSize) => handleSizeChange(newSize ?? MIN_QR_CODE_SIZE)}
                      size="small"
                      step={8}
                      value={size}
                    />
                  </Grid>
                </Grid>
              </Stack>

              <Stack spacing={1}>
                <Typography>Error Correction</Typography>
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  onChange={(event, newLevel: QrCodeErrorCorrectionLevel | null) => {
                    if (newLevel) handleErrorCorrectionLevelChange(newLevel);
                  }}
                  size="small"
                  value={errorCorrectionLevel}
                >
                  {ERROR_CORRECTION_LEVELS.map((level) => (
                    <ToggleButton key={level.value} value={level.value}>
                      {level.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardHeader title="Preview" />
          <CardContent>
            <Stack sx={{ alignItems: "center", justifyContent: "center", minHeight: MIN_QR_CODE_SIZE, py: 2 }}>
              {value ? (
                <QRCodeCanvas level={errorCorrectionLevel} marginSize={2} ref={canvasRef} size={size} value={value} />
              ) : (
                <Typography color="textSecondary">Enter text or a URL to generate a QR code.</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
};
