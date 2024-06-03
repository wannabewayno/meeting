
import { App, TFile } from "obsidian";

export interface IPerson {
  firstname: string;
  lastname: string;
  name: string;
  image: string;
  company: string;
}

export interface IPersonProps {
  firstname: string;
  lastname: string;
  image?: string;
  company?: string;
}

export type Person = new (props: IPersonProps) => IPerson;


const DEFAULTS = {
  image: 'https://example.com',
  company: 'Planit',
}

export default (app: App) => class Person implements IPerson {
  readonly firstname: string;
  readonly lastname: string;
  readonly image: string;
  readonly company: string;

  constructor(props: IPersonProps) {
    Object.assign(this, DEFAULTS, props);
  }

  get name() {
    return [this.firstname, this.lastname].filter(Boolean).join(' ');
  }

  /**
   * Crawl through all markdown files and process their front-matter
   * If any are tagged with the "contactTag" instantiate a new Person instance.
   */
  static findAllPeople(): Person[] {
    // find all files
    // filter by front matter
    // Ideally this should call "findFilesWithTags" or "findFilesWithAllTags"
    // Every file found, pass over to fromFile() to handle the rest.
    return [];
  }

  static fromFile(file: TFile): Person {
    // Extract person props from File and metadata
    return new Person();
  }

  static fromPath(path: string): Person {
    // Find File and then call fromFile
    // getMarkdownFileFromPath();
    return this.fromFile();
  }
}