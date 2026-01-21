import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { formatCurrency } from "../../utils/number";
import type { BillData, Person } from "./types";

const { Text } = Typography;

const DEFAULT_TAX_PERCENT = 6;
const DEFAULT_TIP_PERCENT = 20;

const generateKey = () => Math.random().toString(36).substring(2, 9);

const defaultBillData: BillData = {
  finalTotal: null,
  people: [{ key: generateKey(), name: "", subtotal: 0 }],
  taxPercent: DEFAULT_TAX_PERCENT,
  tipPercent: DEFAULT_TIP_PERCENT,
};
export function useBillCalculator() {
  const [savedData, setSavedData] = useLocalStorage<BillData>("billCalculator", defaultBillData);

  const [finalTotal, setFinalTotal] = useState<number | null>(savedData.finalTotal);
  const [isEditingFinalTotal, setIsEditingFinalTotal] = useState(false);
  const [people, setPeople] = useState<Person[]>(savedData.people);
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
      setTipPercent(Math.round(newTipPercent * 100) / 100);
    }
  }, [finalTotal, isEditingFinalTotal, calculateTipFromFinalTotal, subtotal]);

  // Update final total when tip/tax changes (user not editing final total)
  useEffect(() => {
    if (!isEditingFinalTotal) {
      setFinalTotal(Math.round(calculatedTotal * 100) / 100);
    }
  }, [calculatedTotal, isEditingFinalTotal]);

  const addPerson = () => {
    setPeople([...people, { key: generateKey(), name: "", subtotal: 0 }]);
  };

  const removePerson = (key: string) => {
    if (people.length > 1) {
      setPeople(people.filter((p) => p.key !== key));
    }
  };

  const updatePerson = (key: string, field: keyof Person, value: string | number) => {
    setPeople(people.map((p) => (p.key === key ? { ...p, [field]: value } : p)));
  };

  const handleSave = () => {
    setSavedData({
      people,
      taxPercent,
      tipPercent,
      finalTotal,
    });
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
  const calculateShare = (personSubtotal: number) => {
    if (subtotal === 0) return 0;
    const proportion = personSubtotal / subtotal;
    const effectiveTotal = finalTotal ?? calculatedTotal;
    return proportion * effectiveTotal;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Person) => (
        <Input
          placeholder="Name"
          value={record.name}
          onChange={(e) => updatePerson(record.key, "name", e.target.value)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_: number, record: Person) => (
        <InputNumber
          prefix="$"
          min={0}
          step={0.01}
          value={record.subtotal}
          onChange={(value) => updatePerson(record.key, "subtotal", value ?? 0)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Owes",
      key: "owes",
      render: (_: unknown, record: Person) => <Text strong>{formatCurrency(calculateShare(record.subtotal))}</Text>,
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_: unknown, record: Person) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removePerson(record.key)}
          disabled={people.length === 1}
        />
      ),
    },
  ];

  return {
    addPerson,
    calculatedTotal,
    columns,
    finalTotal,
    handleFinalTotalChange,
    handleReset,
    handleSave,
    handleTaxChange,
    handleTipChange,
    people,
    subtotal,
    taxAmount,
    taxPercent,
    tipAmount,
    tipPercent,
  };
}
