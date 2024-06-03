import NoteProvider, { Note } from './Note';
import PersonProvider, { Person } from './Person';
import MeetingProvider, { Meeting } from './Meeting';
import { IUtilities } from "src/Utilities";

export interface IEntities {
  Note: Note;
  Person: Person;
  Meeting: Meeting;
}

export interface Dependencies {
  Utilities: IUtilities;
}

// Interface for it's dependencies
export default () => ({
  Note: NoteProvider(),
  Person: PersonProvider(),
  Meeting: MeetingProvider(),
});