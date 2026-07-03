import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";
import type { BillData, Person } from "../configuration/types";
import { createDefaultBillData, DEFAULT_TAX_PERCENT, DEFAULT_TIP_PERCENT, generateKey } from "../configuration/utils";

type Props = {
  onSave?: (data: BillData) => void;
  people: Person[];
  setPeople: Dispatch<SetStateAction<Person[]>>;
};

const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

export const useBillCalculator = ({ onSave, people, setPeople }: Props) => {
  const [savedData, setSavedData] = useLocalStorage<BillData>("billCalculator", createDefaultBillData());

  // Non-null when the user edited the final total directly; the tip is then derived from it.
  // Null means the total is derived from tax + tip instead.
  const [finalTotalOverride, setFinalTotalOverride] = useState<number | null>(null);
  const [manualTipPercent, setManualTipPercent] = useState(savedData.tipPercent);
  const [taxPercent, setTaxPercent] = useState(savedData.taxPercent);

  const subtotal = people.reduce((sum, person) => sum + (person.subtotal || 0), 0);
  const taxAmount = subtotal * (taxPercent / 100);
  const tipPercent =
    finalTotalOverride !== null && subtotal > 0
      ? roundToTwoDecimals(Math.max(0, ((finalTotalOverride - subtotal - taxAmount) / subtotal) * 100))
      : manualTipPercent;
  const tipAmount = subtotal * (tipPercent / 100);
  const calculatedTotal = roundToTwoDecimals(subtotal + taxAmount + tipAmount);
  const finalTotal = finalTotalOverride ?? calculatedTotal;

  const handleSave = () => {
    const data: BillData = { finalTotal: finalTotalOverride, people, taxPercent, tipPercent };
    setSavedData(data);
    onSave?.(data);
  };

  const handleReset = () => {
    setPeople([{ key: generateKey(), name: "", subtotal: 0 }]);
    setTaxPercent(DEFAULT_TAX_PERCENT);
    setManualTipPercent(DEFAULT_TIP_PERCENT);
    setFinalTotalOverride(null);
  };

  const handleTaxChange = (value: number | null) => {
    // Leaving override mode: keep the tip the user currently sees rather than snapping back
    setManualTipPercent(tipPercent);
    setFinalTotalOverride(null);
    setTaxPercent(value ?? 0);
  };

  const handleTipChange = (value: number | null) => {
    setFinalTotalOverride(null);
    setManualTipPercent(value ?? 0);
  };

  const handleFinalTotalChange = (value: number | null) => setFinalTotalOverride(value);

  // Calculate each person's share
  const calculateShare = useCallback(
    (personSubtotal: number) => (subtotal === 0 ? 0 : (personSubtotal / subtotal) * finalTotal),
    [subtotal, finalTotal]
  );

  return {
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
  };
};
