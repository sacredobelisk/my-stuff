import { useCallback, useState } from "react";
import type { Person } from "~/components/bill-calculator/configuration/types";
import { createPerson, toSubtotal } from "~/components/bill-calculator/configuration/utils";

/**
 * Owns the list of people on the bill. The list is never allowed to empty out, so the grid
 * always has at least one row to render.
 */
export const useBillCalculatorPeople = (initialPeople: Person[]) => {
  const [people, setPeople] = useState<Person[]>(initialPeople);

  const addPerson = useCallback(() => setPeople((previous) => [...previous, createPerson()]), []);

  const removePerson = useCallback(
    (person: Person) =>
      setPeople((previous) => (previous.length <= 1 ? previous : previous.filter(({ key }) => key !== person.key))),
    []
  );

  const updatePerson = useCallback(
    (person: Person) =>
      setPeople((previous) =>
        previous.map((existing) =>
          existing.key === person.key
            ? { ...person, name: person.name.trim(), subtotal: toSubtotal(person.subtotal) }
            : existing
        )
      ),
    []
  );

  return { addPerson, people, removePerson, setPeople, updatePerson };
};
