import type { App } from 'obsidian';
import EntitiesProvider from '../Entities';
import RepositoryProvider from '../Repository';
import ServiceProvider from 'src/Service';
import ActionProvider, { IAction } from 'src/Action';
import { IPlugin } from 'src/UI/Settings';
import { UIComponent } from 'src/UI/Component';

export type IContainer = IAction;
export interface Dependencies {
  App: App
}

export interface ISettings {
  personDirectory: string,
  personTag: string,
  meetingDirectory: string,
  meetingTag: string,
  recordAudio: boolean,
  backlinkToDailyNotes: boolean,
}

export class SettingsUI extends UIComponent<ISettings> {
  constructor(html: HTMLElement) {
    super(html);

    this.addInput('meetingDirectory', { description: 'The directory where meeting notes are placed' });
    this.addInput('meetingTag', { description: 'The tag that identifies a meeting note' });
    this.addInput('personDirectory', { description: 'The directory where new people notes are placed' });
    this.addInput('personTag', { description: 'The tag that identifies a person note' });
    this.addSwitch('recordAudio', { description: 'If the Audio Recorder is enabled, automatically start recording when a meeting is started and stop recording when a meeting is finnished' });
    this.addSwitch('backlinkToDailyNotes', { description: 'If Daily Notes are activated, backlink a reference of the meeting to the active daily note' });
  }
}

export interface IInfrastructure {
  Settings: ISettings,
  App: App,
}

// TODO: Orchestrate DI through Nested DI Containers
// Each container packs up it's infrastucture through containers
// Then exposes what it needs to, the next container only uses what it can
export default (plugin: IPlugin<ISettings>) => {
  const Infrastructure: IInfrastructure = { Settings: plugin.settings, App: plugin.app };
  const Entities = EntitiesProvider();
  const Repository = RepositoryProvider({ Entities, Infrastructure });
  const Service = ServiceProvider({ Repository, Infrastructure });
  const Action = ActionProvider(Service)

  return Action;
}