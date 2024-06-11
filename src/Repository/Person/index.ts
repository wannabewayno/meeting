import type { INoteRepository, INote } from '../Note';
import { Dependencies as RepositoryDependencies } from '..';
import { IPerson } from 'src/Entities/Person';

export interface IPersonRepository {
  findByNames: (...names: string[]) => IPerson[];
  findAll: () => IPerson[];
  save: (person: IPerson) => void;
  create: (name: string) => Promise<IPerson>;
}

interface Dependencies extends RepositoryDependencies {
  Note: INoteRepository,
}

export default ({ Note: NoteRepository, Entities: { Person }, Infrastructure: { Settings } }: Dependencies) => {
  const noteToPerson = (note: INote): IPerson => {
    let link = note.basename;
    if (Settings.personDirectory) link = `${Settings.personDirectory}/${note.basename}`
    return new Person(note.basename, link);
  }
  // const PersonToNote

  class PersonRepository implements IPersonRepository {
    findByNames(...names: string[]): IPerson[] {
      // Find out where people are saved to disk.
      const { personDirectory  } = Settings;

      // People are Saved to disk like '{{Dir}}/{{name}}.md'
      const filepaths = names.map(name => [personDirectory,  `${name}.md`].filter(Boolean).join('/'))

      return NoteRepository.findNotesByPaths(...filepaths).map(noteToPerson);
    }

    findAll(): IPerson[] {
      const { personTag } = Settings;
      return NoteRepository.findNotesWithAnyTags(personTag).map(noteToPerson);
    }

    save(person: IPerson): void {
      // You would need to know how to Serialize this to a Note.
      // Say personNote = PersonToNote(person);
      // NoteRepository.save(personNote);
      // we could call update or something without having to read/change/replace?
      // No we most liekly would do that as we need to know how to change the document.
      // This get's trickier...
      // Headings would need specific structure... ugh...
      /// Would need somekind of sanity check
    }

    async create(name: string) {
      // Prepare the path and metadata.
      const { personTag, personDirectory } = Settings;
      let path = `${name}.md`;
      if (personDirectory) path = `${personDirectory}/${path}`;

      // Create a Person
      const person = new Person(name, path);
 
      await NoteRepository.createNote(path, person.toString(), { tags: [personTag] });

      // Return the Person
      return person;
    }
  }

  return new PersonRepository();
}