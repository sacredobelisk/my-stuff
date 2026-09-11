export type QrCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrCodeOptions {
  errorCorrectionLevel: QrCodeErrorCorrectionLevel;
  size: number;
  value: string;
}
