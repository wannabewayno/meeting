import { prepareFuzzySearch, FuzzyMatch } from 'obsidian';

export interface SearchableItem<T> {
    item: T;
    index: string;
}
  
export const CreateFuzzySearch = <T>(targets: SearchableItem<T>[]) => (query: string): FuzzyMatch<T>[] => {
  
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