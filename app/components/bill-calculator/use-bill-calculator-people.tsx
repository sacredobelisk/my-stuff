import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { BillData, Person } from "./types";
import { createDefaultBillData } from "./utils";

export function useBillCalculatorPeople() {
  const [savedData] = useLocalStorage<BillData>("billCalculator", createDefaultBillData());

  const [people, setPeople] = useState<Person[]>(savedData.people);

  const addPerson = () => setPeople((prevPeople) => [...prevPeople, { key: uuidv4(), name: "", subtotal: 0 }]);

  const removePerson = useCallback((key: string) => {
    setPeople((prevPeople) => {
      if (prevPeople.length <= 1) {
        return prevPeople;
      }
      return prevPeople.filter((p) => p.key !== key);
    });
  }, []);

  const updatePerson = useCallback((key: string, field: keyof Person, value: string | number) => {
    setPeople((prevPeople) => prevPeople.map((p) => (p.key === key ? { ...p, [field]: value } : p)));
  }, []);

  return { addPerson, people, removePerson, setPeople, updatePerson };
}
