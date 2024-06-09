
export interface IUtilities {
  isSuperset: <T>(A: Set<T>, B: Set<T>) => boolean;
}

/**
  Will return true if A is a superset of B.
  That is, if B is a subset of A.
  Effectively, just walk through all elements in A and if any element is not in then return early with false
  Otherwise every element must be accounted for.
*/
export function isSuperset<T>(A: Set<T>, B: Set<T>): boolean {
  if (A.size < B.size) return false;
  for (const elem of B) if (!A.has(elem)) return false;
  return true;
}