import { useCallback, useRef, useState } from "react";
import type { QrCodeErrorCorrectionLevel } from "~/components/qr-code-generator/configuration/types";
import {
  createDefaultQrCodeOptions,
  getByteLength,
  getMaxBytes,
  MAX_QR_CODE_SIZE,
  MIN_QR_CODE_SIZE,
} from "~/components/qr-code-generator/configuration/utils";

const clampSize = (size: number) => Math.min(MAX_QR_CODE_SIZE, Math.max(MIN_QR_CODE_SIZE, size));

export const useQrCodeGenerator = () => {
  const defaultOptions = createDefaultQrCodeOptions();

  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState(defaultOptions.errorCorrectionLevel);
  const [size, setSize] = useState(defaultOptions.size);
  const [value, setValue] = useState(defaultOptions.value);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const byteLength = getByteLength(value);
  const maxBytes = getMaxBytes(errorCorrectionLevel);
  const isOverCapacity = byteLength > maxBytes;
  const canRender = !!value && !isOverCapacity;

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const handleErrorCorrectionLevelChange = (newLevel: QrCodeErrorCorrectionLevel) => setErrorCorrectionLevel(newLevel);

  const handleSizeChange = (newSize: number | null) => setSize(clampSize(newSize ?? MIN_QR_CODE_SIZE));

  const handleValueChange = (newValue: string) => setValue(newValue);

  const handleReset = () => {
    const resetOptions = createDefaultQrCodeOptions();

    setErrorCorrectionLevel(resetOptions.errorCorrectionLevel);
    setSize(resetOptions.size);
    setValue(resetOptions.value);
  };

  return {
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
  };
};
