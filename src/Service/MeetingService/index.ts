import { IMeeting } from 'src/Entities/Meeting';
import type { Dependencies } from '..';
import { IPerson } from 'src/Entities/Person';
import { IObsidianService } from '../Obsidian';

export interface IMeetingService {
  createMeeting: (title: string, participants: IPerson[], agenda?: string[]) => Promise<IMeeting>;
  stopMeeting: (meeting?: IMeeting) => Promise<void>;
}

interface MeetingServiceDependencies extends Dependencies {
  Obsidian: IObsidianService
}

export default ({ Obsidian, Repository, Infrastructure: { App, Settings } }: MeetingServiceDependencies): IMeetingService => {
  class MeetingService implements IMeetingService {
    private activeMeeting?: IMeeting

    async createMeeting(title: string, participants: IPerson[], agenda?: string[]): Promise<IMeeting> {
      // Create a meeting
      const meeting = await Repository.Meeting.create(title, participants, agenda);
    
      // Backlink the meeting to our daily notes (if applicable)
      if (Settings.backlinkToDailyNotes && Obsidian.isDailyNotesEnabled()) {
        // TODO: Should really be meeting.start()
        const currentTime = window.moment().format('h:mma');
        const backlink = `\n\n## Meeting\n${currentTime}\n${meeting.wikiLink}`;
        await Obsidian.addToDailyNote(backlink);
      }
      
      // Open the Meeting in the UI.
      await this.openMeeting(meeting);
      
      // Start recording (if applicable).
      if (Settings.recordAudio && Obsidian.isAudioRecorderAvailable()) Obsidian.startRecording();

      // Set the Currently Active Meeting.
      this.activeMeeting = meeting;

      return meeting;
    }

    /**
     * Stops a Meeting.
     * If no meeting is provided then we will attempt to use any active meeting.
     * @param meeting 
     */
    async stopMeeting(meeting?: IMeeting) {
      if (!meeting) {
        if (!this.activeMeeting) return;
        meeting = this.activeMeeting;
      }

      // Open Meeting Note.
      this.openMeeting(meeting);

      // Stop Recording.
      Obsidian.stopRecording();

      // Mark Meeting as Stopped and Save it.
      meeting.endedAt = new Date();
      
      // TODO: Maybe I can record what's changed so I can produce a delta?
      await Repository.Meeting.save(meeting);

      // Unset the active meeting.
      this.activeMeeting = undefined;

      /*
        Initiate Post Meeting Actions like
        - Transcription.
        - Summarization.
        - Action Items.
      */
    }

    /*
      THOUGHTS: Could events help here? Dispatch an 'open:file' event to a dispatcher that triggers more actions?
      // This really needs to be openNote(meeting.link)
    */
    async openMeeting(meeting: IMeeting): Promise<void> {
      // We need to find the note behind the meeting
      const file = App.vault.getFileByPath(meeting.link);
      if (!file) return;

      await App.workspace.getLeaf().openFile(file);

      const editor = App.workspace.activeEditor?.editor;
      if (!editor) return;

      // Set the cursor to be the end of the file.
      const endOfThePage = editor.lastLine();
      editor.setCursor(endOfThePage);
    }
  } 

  return new MeetingService();

}