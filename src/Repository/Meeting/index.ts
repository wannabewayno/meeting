import type { INoteRepository, INote } from '../Note';
import Repository, { Dependencies as RepositoryDependencies } from '..';
import { IMeeting } from 'src/Entities/Meeting';
import { IPerson } from 'src/Entities/Person';

export interface IMeetingRepository {
  findByIds: (...names: string[]) => IMeeting[];
  findAll: () => IMeeting[];
  save: (person: IMeeting) => void;
  create: (title: string, participants: IPerson[], agenda?: string[]) => Promise<IMeeting>;
}

interface Dependencies extends RepositoryDependencies {
  Note: INoteRepository,
}

export default ({ Note: NoteRepository, Entities: { Meeting, Person }, Infrastructure: { Settings } }: Dependencies) => {
  const noteToMeeting = (note: INote): IMeeting => {
    // We need to process the Note to get as much of the meeting data out as possible.
    return new Meeting({ title: 'Placeholder', participants: [new Person('me', 'me.md')] });
  }

  class MeetingRepository implements IMeetingRepository {
    findByIds(...ids: string[]): IMeeting[] {
      return [];
    }

    findAll(): IMeeting[] {
      const { meetingTag } = Settings
      return NoteRepository.findNotesWithAnyTags(meetingTag).map(noteToMeeting);
    }

    save(person: IMeeting): void {
      // NoteRepository.save(person);
    }

    async create(title: string, participants: IPerson[], agenda?: string[]): Promise<IMeeting> {
      // Create a new Meeting
      const meeting = new Meeting({ title, participants, agenda });

      // Prepare the path and metadata.
      const { meetingTag } = Settings;
      const path = this.meetingPath(meeting);

      // Create the underlying note.
      await NoteRepository.createNote(path, meeting.toString(), { id: meeting.id, tags: [meetingTag] });

      // Update the meeting to contain the link
      meeting.link = path;

      // Return the Meeting.
      return meeting;
    }

    private meetingPath(meeting: IMeeting): string {
      const { meetingDirectory } = Settings;
      const path = `${meeting.id} - ${meeting.title}.md`;
      if (!meetingDirectory) return path;

      return `${meetingDirectory}/${path}`;
    }
  }

  return new MeetingRepository();
}