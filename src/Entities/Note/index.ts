import { FrontMatterCache } from "obsidian";
import { isSuperset } from "src/Utilities";

export interface INote {
  path: string;
  dirname: string;
  filename: string;
  basename: string;
  filetags: Set<string>;
  hasAnyTags: (...tags: string[]) => boolean;
  hasAllTags: (...tags: string[]) => boolean;
}

export type Note = new (path: string, frontmatter?: FrontMatterCache) => INote;

export default () => class Note implements INote {
  readonly path: string;
  readonly dirname: string;
  readonly filename: string;
  readonly basename: string;
  readonly filetags: Set<string>;

  constructor(path: string, frontmatter?: FrontMatterCache) {
    this.path = path;
    const [filename, ...dirs] = path.split('/').reverse();
    this.filename = filename;
    this.basename = filename.replace(/\.\w+$/,'');
    this.dirname = dirs.reverse().join('/');
    this.filetags = new Set<string>();

    if (frontmatter) {
      this.filetags = new Set<string>(frontmatter.tags || []);
    }
  }

  hasAnyTags(...tags: string[]) {
    for (const tag of tags) if (this.filetags.has(tag)) return true;
    return false;
  }

  hasAllTags(...tags: string[]) {
    return isSuperset(this.filetags, new Set(tags));
  }
}