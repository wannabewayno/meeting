import { prepareFuzzySearch, FuzzyMatch, App, TFile } from 'obsidian';

export const FuzzySearch = (targets: string[]) => (query: string): FuzzyMatch<string>[] => {
    const fuzzySearch = prepareFuzzySearch(query);

    const results = targets
      .reduce((results: FuzzyMatch<string>[], item) => {
        const match = fuzzySearch(item);
        if (!match) return results;
        results.push({ item, match });
        return results;
      }, []);

    results.sort((a, b) => b.match.score - a.match.score);

    return results;
}

export const Vault = (app: App) => ({
    getFilesWithTag: (tag: string): TFile[] => {
        const filesWithTag: TFile[] = [];
        const { vault, metadataCache } = app;

        vault.getMarkdownFiles().forEach((file: TFile) => {
            const cache = metadataCache.getFileCache(file);
            const tags = cache?.frontmatter?.tags as string[] | undefined;
            if (!tags?.length) return;
            if (tags.contains(tag)) filesWithTag.push(file);
        });

        return filesWithTag;
    }
});