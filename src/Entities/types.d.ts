import { App } from "obsidian";
import { Entities } from "src/Entities";
import { IUtilities } from "src/Utilities";

export type { INote } from './Note';

// Value Objects and Utilites
export interface Dependencies {
  ValueObjects: ValueObjects;
  Utilities: IUtilities;
}