import { IMeeting } from 'src/Entities/Meeting';
import type { Dependencies } from '..';

export interface IMeetingService {
  createMeeting: (title: string, participants: string[], agenda?: string[]) => IMeeting;
  stopMeeting: (meeting: IMeeting) => void;
}

export default ({ Repository: { Person, Note } }: Dependencies): IMeetingService => {
  class MeetingService implements IMeetingService {
    createMeeting(title: string, participants: string[], agenda?: string[]): IMeeting {
      // TODO: Create a unique filename for the meeting from the title.
      // TODO: Validate all participants by either creating any that don't exist.
      // TODO: Create the Meeting with the Meeting Repository.
      // TODO: Backlink the meeting to our daily notes.
      // TODO: Open the Meeting in the UI.
      // TODO: Start recording.
    }

    stopMeeting(meeting: IMeeting): void {
      // TODO: Open Meeting Note.
      // TODO: Stop Recording.
      // TODO: Mark Meeting as Stopped and Save it.
      // TODO: Initiate Post Meeting Actions like Summarization, Action Items, Follow Up Questions.
    }
  } 

  return new MeetingService();

}