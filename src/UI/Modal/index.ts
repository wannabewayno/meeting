import { App, Modal as ObsidianModal } from "obsidian";

export type ClosableUI = (html: HTMLElement, closeModal?: () => void) => any;
export type IModal = ObsidianModal;
export interface IModalConstructor {
  new(ui: ClosableUI): IModal;
  Open(ui: ClosableUI, title?: string): IModal;
}

export default ({ App }: { App: App }): IModalConstructor => class Modal extends ObsidianModal implements IModal {
  private ui: ClosableUI

  constructor(ui: ClosableUI) {
    super(App);
    this.ui = ui;
  }

  onOpen() {
    this.ui(this.contentEl, () => this.close());
  }

  onClose() {
    this.contentEl.empty();
  }

  static Open(ui: ClosableUI, title?: string) {
    const modal = new this(ui);
    modal.open();
    if (title) modal.setTitle(title);
    return modal;
  }
}