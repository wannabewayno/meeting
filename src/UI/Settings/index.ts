import { Plugin, PluginSettingTab } from "obsidian";
import { UIComponent } from "../Component";
import { Data } from './Data';
import { Debouncer } from "./Debounce";

export interface IPlugin<T extends Record<string, any>> extends Plugin {
    settings: T
}

export class Settings<T extends Record<string, any>> extends PluginSettingTab {
    plugin: IPlugin<T>;
    ui?: UIComponent<T>;
    UI: typeof UIComponent<T>;

    constructor(plugin: IPlugin<T>, UI: typeof UIComponent<T>, defaults: T) {
        super(plugin.app, plugin);
        this.plugin = plugin;
        this.UI = UI;
        this.plugin.settings = new Data<T>(defaults) as unknown as T;
    }

    /**
     * Responsible for displaying the Setting UI to the user.
     * Thus should instantiate a new instance of the given UI and set it's data to the setting's data.
     */
    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        this.ui = new this.UI(containerEl).setData(this.plugin.settings);
    }

    /**
     * Called when the Settings are not in view
     * Cleans up the view by:
     * - unmounting html
     * - dereferencing the pointing reference to the UI for garbage collection.
     */
    hide() {
        this.containerEl.empty();
        this.ui = undefined;
    }

    /**
	 * Registers itself with the plugin.
	 * Loads data and creates a settings tab for the user to configure.
	 */
	async register() {
		// Load data from disk.
		await this.load();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.plugin.addSettingTab(this);
	}

	async save() {
		await this.plugin.saveData(this.plugin.settings.getData());
	}

	async load() {
		// Load settings from Disk and wrap in our Data proxy
		const data = (await this.plugin.loadData()|| {}) as T;

        // Use the Data proxy's event emitter ability to react to changes when the data is updated by debouncing a call to 'save' back to the disk
        this.plugin.settings.on('change', Debouncer(() => this.save()));

        // Finally assign this to settings so the rest of the application can use it.
        Object.assign(this.plugin.settings, data); // <--- Assert the type because of some proxy magic
	}
}