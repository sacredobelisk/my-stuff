import { useCallback, useMemo, useState } from "react";
import type { BillData, Person } from "~/components/bill-calculator/configuration/types";
import {
  allocateShares,
  createDefaultBillData,
  createPerson,
  DEFAULT_TAX_PERCENT,
  DEFAULT_TIP_PERCENT,
  parseBillData,
} from "~/components/bill-calculator/configuration/utils";
import { useBillCalculatorPeople } from "~/components/bill-calculator/hooks/use-bill-calculator-people";
import { roundToCents } from "~/helpers/numbers";
import { useLocalStorage } from "~/hooks/use-local-storage";

const STORAGE_KEY = "billCalculator";

/**
 * Which end of the bill the user is steering. Only one can be the source of truth at a time:
 * - `percent` — the tip percentage drives the final total.
 * - `total` — the typed final total drives the tip percentage.
 */
type BillMode = "percent" | "total";

interface Props {
  onSave?: (data: BillData) => void;
}

export const useBillCalculator = ({ onSave }: Props = {}) => {
  const [savedData, setSavedData] = useLocalStorage<BillData>(STORAGE_KEY, createDefaultBillData, {
    parse: parseBillData,
  });

  const { addPerson, people, removePerson, setPeople, updatePerson } = useBillCalculatorPeople(savedData.people);

  const [mode, setMode] = useState<BillMode>(savedData.finalTotal === null ? "percent" : "total");
  const [targetTotal, setTargetTotal] = useState(savedData.finalTotal ?? 0);
  const [taxPercent, setTaxPercent] = useState(savedData.taxPercent);
  const [tipPercent, setTipPercent] = useState(savedData.tipPercent);

  const subtotal = people.reduce((sum, person) => sum + (person.subtotal || 0), 0);
  const taxAmount = subtotal * (taxPercent / 100);
  const tipAmount = subtotal * (tipPercent / 100);
  const calculatedTotal = subtotal + taxAmount + tipAmount;
  const finalTotal = mode === "total" ? targetTotal : roundToCents(calculatedTotal);

  const shares = useMemo(() => allocateShares(people, finalTotal), [finalTotal, people]);

  const handleTaxChange = (value: number | null) => {
    setMode("percent");
    setTaxPercent(Math.max(0, value ?? 0));
  };

  const handleTipChange = (value: number | null) => {
    setMode("percent");
    setTipPercent(Math.max(0, value ?? 0));
  };

  const handleFinalTotalChange = (value: number | null) => {
    const total = Math.max(0, value ?? 0);

    setMode("total");
    setTargetTotal(total);

    // Fold the typed total straight back into a tip percentage so the two never disagree, and so
    // the total stays meaningful once the people on the bill change.
    if (subtotal > 0) {
      setTipPercent(roundToCents(Math.max(0, ((total - subtotal - taxAmount) / subtotal) * 100)));
    }
  };

  // Changing who is on the bill changes what the total should be, so hand control back to the
  // percentages rather than pinning the old total and silently rewriting the tip.
  const handleAddPerson = useCallback(() => {
    setMode("percent");
    addPerson();
  }, [addPerson]);

  const handleRemovePerson = useCallback(
    (person: Person) => {
      setMode("percent");
      removePerson(person);
    },
    [removePerson]
  );

  const handleUpdatePerson = useCallback(
    (person: Person) => {
      setMode("percent");
      updatePerson(person);
    },
    [updatePerson]
  );

  const handleReset = () => {
    setPeople([createPerson()]);
    setMode("percent");
    setTargetTotal(0);
    setTaxPercent(DEFAULT_TAX_PERCENT);
    setTipPercent(DEFAULT_TIP_PERCENT);
  };

  const handleSave = () => {
    const data: BillData = { finalTotal: mode === "total" ? targetTotal : null, people, taxPercent, tipPercent };

    setSavedData(data);
    onSave?.(data);
  };

  return {
    finalTotal,
    handleAddPerson,
    handleFinalTotalChange,
    handleRemovePerson,
    handleReset,
    handleSave,
    handleTaxChange,
    handleTipChange,
    handleUpdatePerson,
    people,
    shares,
    subtotal,
    taxAmount,
    taxPercent,
    tipAmount,
    tipPercent,
  };
};
