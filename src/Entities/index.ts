import NoteProvider, { Note } from './Note';

export interface Entities {
  Note: Note;
}

// Interface for it's dependencies
export default () => ({
  Note: NoteProvider(),
});