import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";
import type { BillData, Person } from "../configuration/types";
import { createDefaultBillData, DEFAULT_TAX_PERCENT, DEFAULT_TIP_PERCENT, generateKey } from "../configuration/utils";

type Props = {
  onSave?: (data: BillData) => void;
  people: Person[];
  setPeople: Dispatch<SetStateAction<Person[]>>;
};

export const useBillCalculator = ({ onSave, people, setPeople }: Props) => {
  const [savedData, setSavedData] = useLocalStorage<BillData>("billCalculator", createDefaultBillData());

  const [finalTotal, setFinalTotal] = useState<number | null>(savedData.finalTotal);
  const [taxPercent, setTaxPercent] = useState(savedData.taxPercent);
  const [tipPercent, setTipPercent] = useState(savedData.tipPercent);

  const subtotal = people.reduce((sum, person) => sum + (person.subtotal || 0), 0);
  const taxAmount = subtotal * (taxPercent / 100);
  const tipAmount = subtotal * (tipPercent / 100);
  const calculatedTotal = subtotal + taxAmount + tipAmount;

  const handleSave = () => {
    setSavedData({ finalTotal, people, taxPercent, tipPercent });
    onSave?.({ finalTotal, people, taxPercent, tipPercent });
  };

  const handleReset = () => {
    setPeople([{ key: generateKey(), name: "", subtotal: 0 }]);
    setTaxPercent(DEFAULT_TAX_PERCENT);
    setTipPercent(DEFAULT_TIP_PERCENT);
    setFinalTotal(null);
  };

  const handleTaxChange = (value: number | null) => {
    setTaxPercent(value ?? 0);
  };

  const handleTipChange = (value: number | null) => {
    setTipPercent(value ?? 0);
  };

  const handleFinalTotalChange = (value: number | null) => {
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
};
