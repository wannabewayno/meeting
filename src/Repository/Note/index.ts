import { TFile } from 'obsidian';
import type { Dependencies } from '..';
import type { INote } from 'src/Entities/Note';
export type { INote } from 'src/Entities/Note';

export interface INoteRepository {
  findFilesByPaths: (...paths: string[]) => INote[];
  findFilesWithAnyTags: (...tags: string[]) => INote[];
  findFilesWithAllTags: (...tags: string[]) => INote[];
}

export default ({ App: { vault, metadataCache }, Entities: { Note } }: Dependencies): INoteRepository => ({
  findFilesByPaths(...paths: string[]): INote[] {
    return paths.reduce((notes: INote[], path) => {
      const note = vault.getFileByPath(path);
      if (note) {
        const cache = metadataCache.getFileCache(note);
        notes.push(new Note(note.path, cache?.frontmatter))
      }
      return notes;
    }, []);
  },
  findFilesWithAnyTags(...tags: string[]) {
    const filesWithTag: INote[] = [];

    vault.getMarkdownFiles().forEach((file: TFile) => {
      const cache = metadataCache.getFileCache(file);
      const note = new Note(file.path, cache?.frontmatter);
      if (note.hasAnyTags(...tags)) filesWithTag.push(note);
    });

    return filesWithTag;
  },
  findFilesWithAllTags(...tags: string[]): INote[] {
    const filesWithAllTags: INote[] = [];

    vault.getMarkdownFiles().forEach((file: TFile) => {
      const cache = metadataCache.getFileCache(file);
      const note = new Note(file.path, cache?.frontmatter);
      if (note.hasAllTags(...tags)) filesWithAllTags.push(note);
    });

    return filesWithAllTags;
  }
});