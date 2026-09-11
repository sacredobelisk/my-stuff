import type { QrCodeErrorCorrectionLevel, QrCodeOptions } from "~/components/qr-code-generator/configuration/types";

export const DEFAULT_QR_CODE_SIZE = 256;
export const MIN_QR_CODE_SIZE = 128;
export const MAX_QR_CODE_SIZE = 512;
export const QR_CODE_SIZE_STEP = 8;

export const DEFAULT_ERROR_CORRECTION_LEVEL: QrCodeErrorCorrectionLevel = "M";

/**
 * Most bytes a version 40 QR code can hold at each error correction level. Going over these makes
 * the encoder throw, and since it encodes during render that would take the whole page down.
 */
const MAX_BYTES_BY_LEVEL: Record<QrCodeErrorCorrectionLevel, number> = {
  H: 1273,
  L: 2953,
  M: 2331,
  Q: 1663,
};

const TEXT_ENCODER = new TextEncoder();

export const getMaxBytes = (level: QrCodeErrorCorrectionLevel) => MAX_BYTES_BY_LEVEL[level];

export const getByteLength = (value: string) => TEXT_ENCODER.encode(value).length;

export const createDefaultQrCodeOptions = (): QrCodeOptions => ({
  errorCorrectionLevel: DEFAULT_ERROR_CORRECTION_LEVEL,
  size: DEFAULT_QR_CODE_SIZE,
  value: "",
});
