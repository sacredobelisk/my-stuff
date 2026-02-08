/** Make K properties in T optional leaving remaining T properties untouched */
export type PartialProperty<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
