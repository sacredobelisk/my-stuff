import type { QrCodeOptions } from "./types";

export const DEFAULT_QR_CODE_SIZE = 256;
export const MIN_QR_CODE_SIZE = 128;
export const MAX_QR_CODE_SIZE = 512;

export const DEFAULT_ERROR_CORRECTION_LEVEL: QrCodeOptions["errorCorrectionLevel"] = "M";

export const createDefaultQrCodeOptions = (): QrCodeOptions => ({
  errorCorrectionLevel: DEFAULT_ERROR_CORRECTION_LEVEL,
  size: DEFAULT_QR_CODE_SIZE,
  value: "",
});
