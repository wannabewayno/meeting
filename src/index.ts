import { App, Editor, MarkdownView, Notice, Plugin, PluginManifest } from 'obsidian';
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

	// That is an annoying price to pay for something we can solve further up the chain.
	// What if new Settings returns this for us? And we can load/unload into it as we want.
  }

	async onload() {
		await this._settings.register();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			this.container.CreateMeeting();
		});

		this.addRibbonIcon('contact', 'Log People to Console', (evt: MouseEvent) => {
			this.container.FindAllPeople();
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				// new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						// new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		// is there anything to unload?
	}
}
