import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

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
 * @param initialValue - The value (or lazy factory) used when storage is empty or unreadable.
 * @param options - Optional `parse` validator applied to whatever comes out of storage.
 * @returns A stateful value and a function to update it.
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T),
  { parse }: UseLocalStorageOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>] => {
  const parseStoredValue = useCallback(
    (raw: string | null): T | null => {
      if (raw === null) return null;

      try {
        const parsed: unknown = JSON.parse(raw);
        return parse ? parse(parsed) : (parsed as T);
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error); // eslint-disable-line no-console
        return null;
      }
    },
    [key, parse]
  );

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return resolveInitialValue(initialValue);

    try {
      // Touching localStorage at all throws where site data is blocked (Safari private browsing,
      // hardened browser settings), so the read has to be guarded, not just the parse.
      return parseStoredValue(window.localStorage.getItem(key)) ?? resolveInitialValue(initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error); // eslint-disable-line no-console
      return resolveInitialValue(initialValue);
    }
  });

  // Mirrors the committed value so a functional update resolves against the latest one even when
  // several land in the same tick, and so `setValue` can stay stable across renders.
  const latestValueRef = useRef(storedValue);

  const commit = useCallback((value: T) => {
    latestValueRef.current = value;
    setStoredValue(value);
  }, []);

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      const valueToStore = value instanceof Function ? value(latestValueRef.current) : value;

      commit(valueToStore);

      if (typeof window === "undefined") return;

      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error); // eslint-disable-line no-console
      }
    },
    [commit, key]
  );

  // Keep in sync with changes made in other tabs/windows.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;

      const nextValue = parseStoredValue(event.newValue);
      if (nextValue !== null) commit(nextValue);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [commit, key, parseStoredValue]);

  return [storedValue, setValue];
};
