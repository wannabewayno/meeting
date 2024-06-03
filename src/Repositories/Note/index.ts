import { TFile } from 'obsidian';
import { Dependencies } from '../types';
import type { INote } from 'src/Entities/types';

export interface INoteRepository {
  getFilesWithAnyTags: (...tags: string[]) => INote[];
  getFilesWithAllTags: (...tags: string[]) => INote[];
}

export default ({ App, Entities: { Note } }: Dependencies): INoteRepository => ({

  getFilesWithAnyTags: (...tags: string[]) => {
    const { vault, metadataCache } = App;

    const filesWithTag: INote[] = [];

    vault.getMarkdownFiles().forEach((file: TFile) => {
      const cache = metadataCache.getFileCache(file);
      const note = new Note(file.path, cache?.frontmatter);
      if (note.hasAnyTags(...tags)) filesWithTag.push(note);
    });

    return filesWithTag;
  },

  getFilesWithAllTags: (...tags: string[]): INote[] => {
    const { vault, metadataCache } = App;

    const filesWithAllTags: INote[] = [];

    vault.getMarkdownFiles().forEach((file: TFile) => {
      const cache = metadataCache.getFileCache(file);
      const note = new Note(file.path, cache?.frontmatter);
      if (note.hasAllTags(...tags)) filesWithAllTags.push(note);
    });

    return filesWithAllTags;
  }
});