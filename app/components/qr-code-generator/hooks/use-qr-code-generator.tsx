import { useCallback, useRef, useState } from "react";
import type { QrCodeErrorCorrectionLevel } from "../configuration/types";
import { createDefaultQrCodeOptions } from "../configuration/utils";

export function useQrCodeGenerator() {
  const defaultOptions = createDefaultQrCodeOptions();

  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState(defaultOptions.errorCorrectionLevel);
  const [size, setSize] = useState(defaultOptions.size);
  const [value, setValue] = useState(defaultOptions.value);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const handleErrorCorrectionLevelChange = (newLevel: QrCodeErrorCorrectionLevel) => {
    setErrorCorrectionLevel(newLevel);
  };

  const handleReset = () => {
    const resetOptions = createDefaultQrCodeOptions();
    setErrorCorrectionLevel(resetOptions.errorCorrectionLevel);
    setSize(resetOptions.size);
    setValue(resetOptions.value);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
  };

  return {
    canvasRef,
    errorCorrectionLevel,
    handleDownload,
    handleErrorCorrectionLevelChange,
    handleReset,
    handleSizeChange,
    handleValueChange,
    size,
    value,
  };
}
