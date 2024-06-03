import { App } from "obsidian"
import { IEntities } from "src/Entities"
import NoteProvider, { INoteRepository } from './Note';
import PersonProvider, { IPersonRepository } from './Person';
import MeetingProvider, { IMeetingRepository } from "./Meeting";

export interface IRepository {
  Note: INoteRepository
  Person: IPersonRepository,
  Meeting: IMeetingRepository,
}

// Infrastructure, Entities, Aggregates That's all this needs.
export interface Dependencies {
  App: App;
  Entities: IEntities;
}

// Interface for it's dependencies
export default (dependencies: Dependencies): IRepository => {
  const Note = NoteProvider(dependencies);
  const Person = PersonProvider({ Note, ...dependencies });
  const Meeting = MeetingProvider({ Note, ...dependencies });

  return {
    Note,
    Person,
    Meeting,
  }
};