import NoteProvider, { INoteRepository } from './Note';
import { Dependencies } from './types';

export interface Repository {
  Note: INoteRepository
}

// Interface for it's dependencies
export default (dependencies: Dependencies): Repository => ({
  Note: NoteProvider(dependencies),
});