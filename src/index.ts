import { App, Editor, MarkdownView, Notice, Plugin, PluginManifest } from 'obsidian';
import Container, { IContainer } from './Container';
// import { CreateMeetingForm } from './UI/Form/CreateMeeting';
import { CreateMeetingData, CreateMeetingUI } from './UI/Component/CreateMeetingUI';
import { Settings } from './UI/Settings';
// import Modal from './UI/Modal';

// const createMeetingForm = CreateMeetingForm((data) => {
// 	console.log('Submitting Form', data);
// });

// Define Settings Here.
// TODO: Configuration Options
	// Meeting Template Location
	// Meeting Dir (to place notes)
	// Dropdown
		// Same folder as current note.
		// Folder called "xxx" in current note.
		// The folder mentioned below.
	// Contact Tag (person)
	// Contact Dir
	// Dropdown
		// Same folder as current note.
		// Folder called "xxx" in current note.
		// The folder mentioned below.
// console.log(this.vault.getFilesWithTag("person"));

// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'default'
// }

export default class MyPlugin extends Plugin {
  settings: CreateMeetingData;
  protected container: IContainer;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
	// TODO: Build the container from the app...
	// It will contain the Plugin, the App and our Settings/Config
	this.container = Container({ App: this.app });
  }

	async onload() {
		const settings = new Settings<CreateMeetingData>(this, CreateMeetingUI);
		await settings.register();

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
