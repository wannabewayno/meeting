import { prepareFuzzySearch, FuzzyMatch } from 'obsidian';

export interface Utilities {
  FuzzySearch: <T>(targets: SearchableItem<T>[]) => (query: string) => FuzzyMatch<T>[];
  isSuperset: <T>(A: Set<T>, B: Set<T>) => boolean;
}

interface SearchableItem<T> {
  item: T;
  index: string;
}  

export const FuzzySearch = <T>(targets: SearchableItem<T>[]) => (query: string): FuzzyMatch<T>[] => {

  const fuzzySearch = prepareFuzzySearch(query);

  const results = targets
    .reduce((results: FuzzyMatch<T>[], { item, index }) => {
      const match = fuzzySearch(index);
      if (!match) return results;
      results.push({ item, match });
      return results;
    }, []);

  results.sort((a, b) => b.match.score - a.match.score);

  return results;
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