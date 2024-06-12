import type { App as ObsidianApp, TFile } from "obsidian";
import { Dependencies } from "..";

interface Command {
    icon: string;
    id: string;
    name: string;
}

interface PluginInstance {
    defaultOn: boolean;
    description: string;
    id: string;
    name: string;
    options: Record<string, any>; 
}

interface Plugin {
    commands: Command[],
    enabled: boolean,
    instance: PluginInstance
}

interface DailyNotesSettings {
    format: string,
    folder: string,
    template: string,
    autorun: boolean,
}

interface App extends ObsidianApp {
  commands: {
    commands: Record<string,any>;
    executeCommandById: (id: string) => void;
  }
  internalPlugins: {
    config: Record<string, boolean>;
    plugins: Record<string, Plugin>; 
  }
}

interface PollUntilOpts {
    timeout?: number;
    period?: number;
}

function pollUntil<T>(producer: () => T, { timeout = 3000, period = 10 }: PollUntilOpts = {}): Promise<NonNullable<T>> {
    return new Promise(async (resolve, reject) => {
        const start = Date.now();
        while(true) {
            // poll it until it shows up.
            const value = producer(); 
            if (value) {
                resolve(value as NonNullable<T>);
                break;
            } else if ((Date.now() - start) >= timeout) {
                reject(new Error(`[pollUntil] Timeout of ${timeout} exceeded`));
                break;
            }
            await sleep(period); // lil nap
        }
    });
}

export interface IObsidianService {
    executeCmd: (id: string) => void;
    startRecording: () => void;
    stopRecording: () => void;
    addToDailyNote: (content: string) => Promise<void>;
    isDailyNotesEnabled: () => boolean;
    isAudioRecorderAvailable: () => boolean;
}

enum Plugins {
    DAILY_NOTES = 'daily-notes',
    AUDIO_RECORDER = 'audio-recorder',
}

export default ({ Repository, Infrastructure: { App: app } }: Dependencies): IObsidianService => {
    const App = app as App;
    const { commands, internalPlugins, vault } = App;

    class ObsidianService implements IObsidianService {

        private getDailyNotesSettings(): DailyNotesSettings {
            const dailyNotes = App.internalPlugins.plugins[Plugins.DAILY_NOTES];

            const { format, folder, template, autorun } = dailyNotes.instance.options || {};
            return {
                format: format ?? 'YYYY-MM-DD',
                folder: folder ?? '',
                template: template ?? '',
                autorun: autorun ?? false,
            }
        }

        private getDailyNotePath(): string {
            const { folder, format } = this.getDailyNotesSettings();
            const date = window.moment().format(format);
            let dailyNotePath = `${date}.md`;
            if (folder) dailyNotePath = `${folder}/${date}.md`;
        
            return dailyNotePath;
        }

        private getCurrentDailyNote(): TFile | null {
            if (!this.isDailyNotesEnabled()) return null;

            const todaysNote = this.getDailyNotePath();
            return vault.getFileByPath(todaysNote);
        }

        /**
         * This does exactly what "create daily notes does"
         * However there's no official feedback from this...
         * So I'm implementing it myself so that I have a fullproof solution.
         */
        async createTodaysDailyNote(): Promise<TFile> {
            // Execute the command.
            this.executeCmd('daily-notes');

            // wait for this to show up.
            return pollUntil<TFile|null>(() => this.getCurrentDailyNote(), { timeout: 3000 })
        }

        async addToDailyNote(content: string) {
            // Not Enabled? No Worries
            if (!this.isDailyNotesEnabled()) return;
            let dailyNote = this.getCurrentDailyNote();

            // Go Create the daily note if it's not already there.
            if (!dailyNote) dailyNote = await this.createTodaysDailyNote();
            await vault.append(dailyNote, content);
        }

        executeCmd(id: string) {
            commands.executeCommandById(id);
        }

        isDailyNotesEnabled() {
            return Boolean(internalPlugins.config[Plugins.DAILY_NOTES])
        }

        isAudioRecorderAvailable(): boolean {
            return Boolean(internalPlugins.config[Plugins.AUDIO_RECORDER]);
        }

        startRecording() {
            if (!this.isAudioRecorderAvailable()) return;
            this.executeCmd('audio-recorder:start');
        };

        stopRecording() {
            if (!this.isAudioRecorderAvailable()) return;
            this.executeCmd('audio-recorder:stop');
        };
    }

    return new ObsidianService();
} 