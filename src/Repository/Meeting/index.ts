import type { INoteRepository, INote } from '../Note';
import { Dependencies as RepositoryDependencies } from '..';
import { IMeeting } from 'src/Entities/Meeting';
import { IPerson } from 'src/Entities/Person';

export interface IMeetingRepository {
  findByIds: (...names: string[]) => IMeeting[];
  findAll: () => IMeeting[];
  save: (person: IMeeting) => void;
  create: (title: string, participants: IPerson[]) => IMeeting;
}

interface Dependencies extends RepositoryDependencies {
  Note: INoteRepository,
}

export default ({ Note: NoteRepository, Entities: { Meeting, Person } }: Dependencies) => {
  const noteToMeeting = (note: INote): IMeeting => {
    // We need to process the Note to get as much of the meeting data out as possible.
    return new Meeting({ title: 'hello', participants: [new Person('me')] });
  }

  class MeetingRepository implements IMeetingRepository {
    findByIds(...ids: string[]): IMeeting[] {
      return [];
    }

    findAll(): IMeeting[] {
      // TODO: the PersonTag needs to come from the configuration settings :D
      return NoteRepository.findFilesWithAnyTags('meeting').map(noteToMeeting);
    }

    save(person: IMeeting): void {
      // NoteRepository.save(person);
    }

    create(title: string, participants: IPerson[]): IMeeting {
      // Create a new Meeting
      const meeting = new Meeting({ title, participants });
      // Save the person to disk?

      // Return the Person
      return meeting;
    }
  }

  return new MeetingRepository();
}