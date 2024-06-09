import { Setting } from "obsidian";
import { UIComponent, UIEvents } from "../Component";
import { ButtonComponent } from "obsidian";

export type SubmitFn<T> = (data: T) => void;

// Form can now extend UIComponent and just add a button or two.
export class Form<T extends Record<string,any>> {
  private UI: UIComponent<T>;
  private submitButton: ButtonComponent;
  private onSubmit: (data: T) => void;

  constructor(UI: UIComponent<T>, onSubmit: SubmitFn<T>) {
    this.UI = UI;
    this.onSubmit = onSubmit;
    this.addSubmitButton(UI.html);
    
    // Listen for validation events and rerender the submittability of the form.
    this.UI.on(UIEvents.VALIDATE, () => {
      this.canSubmit()
    });
  }

  private addSubmitButton(html: HTMLElement) {
    new Setting(html).addButton(submitButton => {
      this.submitButton = submitButton;
      submitButton.setButtonText('Ok');
      this.canSubmit();
      submitButton.onClick(() => this.submit());
    });
  }

  private canSubmit() {
    if (this.UI.isValid) this.enableSubmitButton();
    else this.disableSubmitButton();
  }

  private enableSubmitButton() {
    this.submitButton.setCta().setDisabled(false);
  }

  private disableSubmitButton() {
    this.submitButton.removeCta().setDisabled(true);
  }

  submit() {
    // Pass the Data to the Action when Submiting the form.
    this.onSubmit(this.UI.getData());
  }

  static Factory<U extends Record<string,any>>(UI: typeof UIComponent<U>, submit: SubmitFn<U>) {
    return (html: HTMLElement, onSubmit?: () => void) => new Form<U>(new UI(html), (data: U) => {
      submit(data);
      if (onSubmit) onSubmit();
    }); 
  }
}