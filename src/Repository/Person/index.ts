import type { INoteRepository, INote } from '../Note';
import { Dependencies as RepositoryDependencies } from '..';
import { IPerson } from 'src/Entities/Person';

export interface IPersonRepository {
  findByNames: (...names: string[]) => IPerson[];
  findAll: () => IPerson[];
  save: (person: IPerson) => void;
  create: (name: string) => IPerson;
}

interface Dependencies extends RepositoryDependencies {
  Note: INoteRepository,
}

export default ({ Note: NoteRepository, Entities: { Person } }: Dependencies) => {
  const noteToPerson = (note: INote): IPerson => new Person(note.basename);

  class PersonRepository implements IPersonRepository {
    findByNames(...names: string[]): IPerson[] {
      // We need to Effectively find out where they're saved to disk and fetch them by Path.
      // TODO: Pull this from the Config
      const personDirectory = 'Leaves';

      // People are Saved to Disk via their names;
      const filepaths = names.map(name => `${personDirectory}/${name}`);

      return NoteRepository.findFilesByPaths(...filepaths).map(noteToPerson);
    }

    findAll(): IPerson[] {
      // TODO: the PersonTag needs to come from the configuration settings :D
      return NoteRepository.findFilesWithAnyTags('person').map(noteToPerson);
    }

    save(person: IPerson): void {
      // NoteRepository.save(person);
    }

    create(name: string): IPerson {
      // Create a Person
      const person = new Person(name);
      // Save the person to disk?

      // Return the Person
      return person;
    }
  }

  return new PersonRepository();
}