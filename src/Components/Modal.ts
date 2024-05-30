import { App, Modal as ObsidianModal } from "obsidian";
import Component from "./Component";

export default (app: App) => class Modal extends ObsidianModal {
  private component: typeof Component;

  constructor(component: typeof Component) {
    super(app);
    this.component = component;
  }

  onOpen() {
    const { contentEl, containerEl } = this;
    console.log("Open");
    new this.component(contentEl);
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }


  static Open(component: typeof Component) {
    const modal = new this(component);
    modal.open();
    return modal;
  }

}