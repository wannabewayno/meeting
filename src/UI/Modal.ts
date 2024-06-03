import { App, Modal as ObsidianModal } from "obsidian";
import { IForm, Form } from "./UIComponent";

export default (app: App) => class Modal extends ObsidianModal {
  private Form: typeof Form;
  private form: IForm | null;

  constructor(component: typeof Form, onSubmit: (any) => void) {
    super(app);
    this.Form = component;
    this.form = null;
  }

  onOpen() {
    const { contentEl } = this;
    this.form = new this.Form(contentEl, (data) => {
      this.close();
      this.onSubmit(data);
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    this.form = null;
  }


  static Open(component: typeof Form, onSubmit) {
    const modal = new this(component, onSubmit);
    modal.open();
    return modal;
  }

}