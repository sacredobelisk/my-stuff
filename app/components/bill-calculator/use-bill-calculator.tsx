import { message } from "antd";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { BillData, Person } from "./types";
import { createDefaultBillData, DEFAULT_TAX_PERCENT, DEFAULT_TIP_PERCENT, generateKey } from "./utils";

type Props = {
  people: Person[];
  setPeople: Dispatch<SetStateAction<Person[]>>;
};

export function useBillCalculator({ people, setPeople }: Props) {
  const [savedData, setSavedData] = useLocalStorage<BillData>("billCalculator", createDefaultBillData());

  const [finalTotal, setFinalTotal] = useState<number | null>(savedData.finalTotal);
  const [isEditingFinalTotal, setIsEditingFinalTotal] = useState(false);
  const [taxPercent, setTaxPercent] = useState(savedData.taxPercent);
  const [tipPercent, setTipPercent] = useState(savedData.tipPercent);

  const subtotal = people.reduce((sum, person) => sum + (person.subtotal || 0), 0);
  const taxAmount = subtotal * (taxPercent / 100);
  const tipAmount = subtotal * (tipPercent / 100);
  const calculatedTotal = subtotal + taxAmount + tipAmount;

  // When final total is manually set, calculate the implied tip percentage
  const calculateTipFromFinalTotal = useCallback(
    (total: number) => {
      if (subtotal === 0) return tipPercent;
      const impliedTip = total - subtotal - taxAmount;
      return Math.max(0, (impliedTip / subtotal) * 100);
    },
    [subtotal, taxAmount, tipPercent]
  );

  // Update tip when final total changes (user editing final total)
  useEffect(() => {
    if (isEditingFinalTotal && finalTotal !== null && subtotal > 0) {
      const newTipPercent = calculateTipFromFinalTotal(finalTotal);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTipPercent(Math.round(newTipPercent * 100) / 100);
    }
  }, [calculateTipFromFinalTotal, finalTotal, isEditingFinalTotal, subtotal]);

  // Update final total when tip/tax changes (user not editing final total)
  useEffect(() => {
    if (!isEditingFinalTotal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFinalTotal(Math.round(calculatedTotal * 100) / 100);
    }
  }, [calculatedTotal, isEditingFinalTotal]);

  const handleSave = () => {
    setSavedData({ finalTotal, people, taxPercent, tipPercent });
    message.success("Bill saved to browser storage");
  };

  const handleReset = () => {
    setPeople([{ key: generateKey(), name: "", subtotal: 0 }]);
    setTaxPercent(DEFAULT_TAX_PERCENT);
    setTipPercent(DEFAULT_TIP_PERCENT);
    setFinalTotal(null);
    setIsEditingFinalTotal(false);
  };

  const handleTaxChange = (value: number | null) => {
    setIsEditingFinalTotal(false);
    setTaxPercent(value ?? 0);
  };

  const handleTipChange = (value: number | null) => {
    setIsEditingFinalTotal(false);
    setTipPercent(value ?? 0);
  };

  const handleFinalTotalChange = (value: number | null) => {
    setIsEditingFinalTotal(true);
    setFinalTotal(value);
  };

  // Calculate each person's share
  const calculateShare = useCallback(
    (personSubtotal: number) => {
      if (subtotal === 0) return 0;
      const proportion = personSubtotal / subtotal;
      const effectiveTotal = finalTotal ?? calculatedTotal;
      return proportion * effectiveTotal;
    },
    [subtotal, finalTotal, calculatedTotal]
  );

  return {
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
  };
}
