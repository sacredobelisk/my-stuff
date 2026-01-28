import { useState } from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { BillData, Person } from "../configuration/types";
import { createDefaultBillData, generateKey } from "../configuration/utils";

export function useBillCalculatorPeople() {
  const [savedData] = useLocalStorage<BillData>("billCalculator", createDefaultBillData());

  const [people, setPeople] = useState<Person[]>(savedData.people);

  const addPerson = () => setPeople((prevPeople) => [...prevPeople, { key: generateKey(), name: "", subtotal: 0 }]);

  const removePerson = (person: Person) =>
    setPeople((prevPeople) => {
      if (prevPeople.length <= 1) {
        return prevPeople;
      }
      return prevPeople.filter((p) => p.key !== person.key);
    });

  const updatePerson = (person: Person) =>
    setPeople((prevPeople) =>
      prevPeople.map((p) => (p.key === person.key ? { ...person, subtotal: Number(person.subtotal) } : p))
    );

  return { addPerson, people, removePerson, setPeople, updatePerson };
}
