import { App, Plugin, PluginManifest } from 'obsidian';
import Container, { IContainer, ISettings, SettingsUI } from './Container';
import { Settings } from './UI/Settings';

export default class MyPlugin extends Plugin {
  settings: ISettings;
  _settings: Settings<ISettings>;
  protected container: IContainer;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
	this._settings = new Settings<ISettings>(this, SettingsUI, {
		meetingDirectory: 'meetings',
		meetingTag: 'meeting',
		personDirectory: 'people',
		personTag: 'person',
		recordAudio: true,
		backlinkToDailyNotes: true,
	});
	this.container = Container(this);
  }

	async onload() {
		await this._settings.register();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'meeting:create',
			name: 'Create a new meeting',
			callback: this.container.CreateMeeting
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = plugin.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');
		// statusBarItemEl.onClickEvent(() => console.log("Going to Meeting"));

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'meeting:stop',
			name: 'Stop an active meeting',
			callback: this.container.StopMeeting
		});
	}
}
