import { IMeeting } from 'src/Entities/Meeting';
import type { Dependencies } from '..';
import { IPerson } from 'src/Entities/Person';

export interface IMeetingService {
  createMeeting: (title: string, participants: IPerson[], agenda?: string[]) => IMeeting;
  stopMeeting: (meeting: IMeeting) => void;
}

export default ({ Repository }: Dependencies): IMeetingService => {
  class MeetingService implements IMeetingService {
    createMeeting(title: string, participants: IPerson[], agenda?: string[]): IMeeting {
      // TODO: Create a unique filename for the meeting from the title.
      console.log("Create unique file name");
      // TODO: Validate all participants by either creating any that don't exist.

      // TODO: Create the Meeting with the Meeting Repository.
      const meeting = Repository.Meeting.create(title, participants);
      console.log(meeting);

      return meeting;

      // Meeting.open for example should open the meeting? or should MeetingService do this?
      // I kinda like it doing this but that would require access to the UI
      // Could events help here? Dispatch an 'open:file' event to a dispatcher that triggers more actions?

      // TODO: Backlink the meeting to our daily notes.

      // TODO: Open the Meeting in the UI.

      // TODO: Start recording.
      // Need an Obsidian.executeCmd() or similar.
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