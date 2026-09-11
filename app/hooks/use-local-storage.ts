import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface UseLocalStorageOptions<T> {
  /**
   * Validates the JSON parsed out of storage before it becomes state. Return `null` to reject a
   * malformed payload and fall back to the initial value.
   */
  parse?: (value: unknown) => T | null;
}

const resolveInitialValue = <T>(initialValue: T | (() => T)) =>
  initialValue instanceof Function ? initialValue() : initialValue;

/**
 * Manages a value backed by localStorage, kept in sync across tabs.
 * @param key - The localStorage key.
 * @param initialValue - The value (or lazy factory) used when storage is empty or invalid.
 * @param options - Optional `parse` validator applied to whatever comes out of storage.
 * @returns A stateful value and a function to update it.
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T),
  { parse }: UseLocalStorageOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>] => {
  const readStoredValue = useCallback(
    (raw: string | null): T | null => {
      if (raw === null) return null;
      try {
        const parsed: unknown = JSON.parse(raw);
        return parse ? parse(parsed) : (parsed as T);
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error); // eslint-disable-line no-console
        return null;
      }
    },
    [key, parse]
  );

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return resolveInitialValue(initialValue);
    return readStoredValue(window.localStorage.getItem(key)) ?? resolveInitialValue(initialValue);
  });

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window === "undefined") return;

      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error); // eslint-disable-line no-console
      }
    },
    [key, storedValue]
  );

  // Keep in sync with changes made in other tabs/windows.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;

      const nextValue = readStoredValue(event.newValue);
      if (nextValue !== null) setStoredValue(nextValue);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, readStoredValue]);

  return [storedValue, setValue];
};
