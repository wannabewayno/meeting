import { App } from "obsidian"
import { IEntities } from "src/Entities"
import NoteProvider, { INoteRepository } from './Note';
import PersonProvider, { IPersonRepository } from './Person';
import MeetingProvider, { IMeetingRepository } from "./Meeting";
import { IInfrastructure, ISettings } from "src/Container";

export interface IRepository {
  Note: INoteRepository
  Person: IPersonRepository,
  Meeting: IMeetingRepository,
}

// Infrastructure, Entities, Aggregates That's all this needs.
export interface Dependencies {
  Entities: IEntities;
  Infrastructure: IInfrastructure;
}

// Interface for it's dependencies
export default (dependencies: Dependencies): IRepository => {
  const Note = NoteProvider(dependencies);
  const NoteDependencies = { Note, Entities: dependencies.Entities, Infrastructure: dependencies.Infrastructure };
  const Person = PersonProvider(NoteDependencies);
  const Meeting = MeetingProvider(NoteDependencies);

  return {
    Note,
    Person,
    Meeting,
  }
};