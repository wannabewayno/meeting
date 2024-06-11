import type { App as ObsidianApp } from "obsidian";
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

interface App extends ObsidianApp {
  commands: {
    commands: Record<string,any>;
    executeCommandById: (id: string) => void;
  }
  internalPlugins: {
    config: Record<string, boolean>,
    getPlugin: (pluginId: string) => any; 
  }
}

export interface IObsidianService {
    executeCmd: (id: string) => void;
    startRecording: () => void;
    stopRecording: () => void;
    getPlugin: (id: string) => void;
}

const AudioRecorderStart = 'audio-recorder:start';
const AudioRecorderEnd = 'audio-recorder:end';

export default ({ Infrastructure: { App: app } }: Dependencies): IObsidianService => {
    const App = app as App

    class ObsidianService implements IObsidianService {

        getPlugin() {
            // console.log("getting plugins");
            console.log(App.internalPlugins);

            // I need the Date Format and the File Location.
            // By default it goes into the root
            // By default the Date Format is YYYY-MM-DD (altough that's not states anywhere.)
        }

        async getCurrentDailyNote() {
            console.log(App.internalPlugins);
        }

        async addToDailyNote() {

        }

        executeCmd(id: string) {
            App.commands.executeCommandById(id);
        }

        isAudioRecorderAvailable(): boolean {
            return Boolean(App.internalPlugins.config['audio-recorder']);
        }

        startRecording() {
            if (!this.isAudioRecorderAvailable()) return;
            this.executeCmd('audio-recorder:start');
        };

        stopRecording() {
            if (!this.isAudioRecorderAvailable()) return;
            this.executeCmd('audio-recorder:stop');
        };

        // I would need to integrate into the Daily Notes Plugin
        // Find out if it's Available
        // if it is... what it's settings are
        // Should be in Obsidian Service.
        // TODO: Find Daily Note Link
        // TODO: Append to Daily Note File the current time and Meeting wikiLink
        // How do I do this... ideally not service is the way to go here I think...
        // Instead of a repository... where the repo can use the service?
        // daily note service?
    }

    return new ObsidianService();
}