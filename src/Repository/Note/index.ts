import { stringify } from 'yaml' 
import { TFile } from 'obsidian';
import type { Dependencies } from '..';
import type { INote } from 'src/Entities/Note';
export type { INote } from 'src/Entities/Note';

export interface INoteRepository {
  findNotesByPaths: (...paths: string[]) => INote[];
  findNotesWithAnyTags: (...tags: string[]) => INote[];
  findNotesWithAllTags: (...tags: string[]) => INote[];
  createNote: (path: string, content: string, frontmatter?: Record<string, any>) => Promise<INote>;
}

export default ({ Infrastructure: { App: { vault, metadataCache, workspace } }, Entities: { Note } }: Dependencies): INoteRepository => {
  const fileToNote = (file: TFile): INote => {
    const cache = metadataCache.getFileCache(file);
    return new Note(file.path, cache?.frontmatter);
  };

  class NoteRepository {
    findNotesByPaths(...paths: string[]): INote[] {
      return paths.reduce((notes: INote[], path) => {
        const file = vault.getFileByPath(path);
        if (file) notes.push(fileToNote(file))
        return notes;
      }, []);
    }

    findNotesWithAnyTags(...tags: string[]) {
      const filesWithTag: INote[] = [];

      vault.getMarkdownFiles().forEach((file: TFile) => {
        const note = fileToNote(file);
        if (note.hasAnyTags(...tags)) filesWithTag.push(note);
      });

      return filesWithTag;
    }

    findNotesWithAllTags(...tags: string[]): INote[] {
      const filesWithAllTags: INote[] = [];

      vault.getMarkdownFiles().forEach((file: TFile) => {
        const note = fileToNote(file);
        if (note.hasAllTags(...tags)) filesWithAllTags.push(note);
      });

      return filesWithAllTags;
    }

    async createNote(path: string, content: string, frontmatter?: Record<string, any>) {
      if (frontmatter) content = this.toFrontmatterString(frontmatter) + content;
      // check if the folder exists before hand
      await this.createDir(path);

      // Create the note.
      const file = await vault.create(path, content);
      const note = fileToNote(file);
      return note;
    }

    private async createDir(path: string): Promise<void> {
      const { dirname } = this.parsePath(path);
      if (!dirname) return;
      vault.createFolder(dirname).catch(() => {
        /*
          Do nothing with the err;
          If it errors it means the folder already exists, that's fine.
        */
      });
    }

    private parsePath(path: string) {
      const [filename, ...dirnameParts] = path.split('\/').reverse();
      const [extension, ...basenameParts] = filename.split('.').reverse();

      return {
        filename,
        dirname: dirnameParts.join('/'),
        basename: basenameParts.join('.'),
        extension,
      }
    }

    private toFrontmatterString(frontmatter: Record<string, any>) {
      return '---\n' + stringify(frontmatter) + '\n---\n';
    }
  }

  return new NoteRepository();
}