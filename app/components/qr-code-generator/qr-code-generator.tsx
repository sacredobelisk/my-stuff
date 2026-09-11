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
import { NumberField } from "~/components/number-field/number-field";
import type { QrCodeErrorCorrectionLevel } from "~/components/qr-code-generator/configuration/types";
import {
  MAX_QR_CODE_SIZE,
  MIN_QR_CODE_SIZE,
  QR_CODE_SIZE_STEP,
} from "~/components/qr-code-generator/configuration/utils";
import { useQrCodeGenerator } from "~/components/qr-code-generator/hooks/use-qr-code-generator";

const ERROR_CORRECTION_LEVELS: { label: string; value: QrCodeErrorCorrectionLevel }[] = [
  { label: "Low", value: "L" },
  { label: "Medium", value: "M" },
  { label: "Quartile", value: "Q" },
  { label: "High", value: "H" },
];

const MAX_LABEL_PREVIEW_LENGTH = 60;

const describeQrCode = (value: string) => {
  const preview = value.length > MAX_LABEL_PREVIEW_LENGTH ? `${value.slice(0, MAX_LABEL_PREVIEW_LENGTH)}…` : value;
  return `QR code for ${preview}`;
};

export const QrCodeGeneratorPage = () => {
  const {
    byteLength,
    canRender,
    canvasRef,
    errorCorrectionLevel,
    handleDownload,
    handleErrorCorrectionLevelChange,
    handleReset,
    handleSizeChange,
    handleValueChange,
    isOverCapacity,
    maxBytes,
    size,
    value,
  } = useQrCodeGenerator();

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box sx={{ flex: "auto" }}>
          <Typography component="h1" variant="h2">
            QR Code Generator
          </Typography>
          <Typography color="textSecondary">Generate a downloadable QR code from any text or URL.</Typography>
        </Box>

        <Box sx={{ flex: "none" }}>
          <ButtonGroup>
            <Button
              disabled={!canRender}
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
                error={isOverCapacity}
                fullWidth
                helperText={
                  isOverCapacity
                    ? `Too long to encode: ${byteLength} of ${maxBytes} bytes. Shorten the text or lower the error correction level.`
                    : `${byteLength} of ${maxBytes} bytes used.`
                }
                label="Text or URL"
                minRows={3}
                multiline
                onChange={(event) => handleValueChange(event.target.value)}
                placeholder="https://example.com"
                value={value}
              />

              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
                  <Typography id="size-label" sx={{ flex: "auto" }}>
                    Size
                  </Typography>
                  {/* Both controls announce the value themselves, so this readout is decoration. */}
                  <Typography aria-hidden color="textSecondary">
                    {size}px
                  </Typography>
                </Stack>

                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid size="grow">
                    <Slider
                      aria-labelledby="size-label"
                      max={MAX_QR_CODE_SIZE}
                      min={MIN_QR_CODE_SIZE}
                      onChange={(_, newSize) => handleSizeChange(newSize as number)}
                      step={QR_CODE_SIZE_STEP}
                      value={size}
                    />
                  </Grid>
                  <Grid>
                    <NumberField
                      aria-labelledby="size-label"
                      inputSx={{ width: 90 }}
                      max={MAX_QR_CODE_SIZE}
                      min={MIN_QR_CODE_SIZE}
                      onValueChange={handleSizeChange}
                      size="small"
                      step={QR_CODE_SIZE_STEP}
                      value={size}
                    />
                  </Grid>
                </Grid>
              </Stack>

              <Stack spacing={1}>
                <Typography id="error-correction-label">Error Correction</Typography>
                <ToggleButtonGroup
                  aria-labelledby="error-correction-label"
                  color="primary"
                  exclusive
                  onChange={(_, newLevel: QrCodeErrorCorrectionLevel | null) => {
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
              {canRender && (
                <QRCodeCanvas
                  aria-label={describeQrCode(value)}
                  level={errorCorrectionLevel}
                  marginSize={2}
                  ref={canvasRef}
                  role="img"
                  size={size}
                  value={value}
                />
              )}
              {!value && <Typography color="textSecondary">Enter text or a URL to generate a QR code.</Typography>}
              {isOverCapacity && (
                <Typography color="error">The text is too long to fit in a QR code at this level.</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
};
