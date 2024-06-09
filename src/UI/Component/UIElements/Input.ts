import { BaseElement } from "./BaseElement";
import type { UIComponent } from "..";
import type { UIElementOpts } from "./BaseElement";
import { PillContainer, Pill } from "./HtmlEl";
import { TextComponent } from "obsidian";

export class Input extends BaseElement<string> {
    private textEl: TextComponent;

    constructor(ui: UIComponent<any>, name: string, opts: UIElementOpts<string> = {}) {
      super(ui, name, opts);
  
      this.addText(text => {
        this.textEl = text;
        this.refreshState();
  
        // Set onChange to update our state.
        text.onChange(value => this.setState(() => value));
      });
    }

    refreshState(): void {
      this.textEl.setValue(this.getState());
    }
    
    protected isEmpty(value: string): boolean {
      return !value;  
    }
}
  
export class InputList extends BaseElement<string[]> {
  private Pill: Pill;

  constructor(ui: UIComponent<any>, name: string, opts: UIElementOpts<string[]> = {}) {
    super(ui, name, opts);

    // Create way to add and remove items from our list.
    const removeItem = (text: string) => this.setState(currVal => currVal ? currVal.filter(item => item !== text) : []);
    const addItem = (text: string) => {
      if (!text) return;
      this.setState(currVal => currVal ? currVal.concat(text) : [text]);
    }
    this.Pill = PillContainer(ui.html, removeItem);

    // Initialize our list if we have any input values.
    const initialState = this.getState();
    if (initialState) initialState.map(id => this.Pill({ id, name: id }));

    this.addText(text => {
      this.onEnter(text.inputEl, () => {
        const data = text.getValue();
        if (!data) return;

        // Create a UI for the saved data to show to the user as a reminder of what they've entered.
        this.Pill({ id: data, name: data });

        // Add Data
        addItem(data);

        // Clear the Input
        text.setValue('');
      });
    });
  }

  refreshState(): void {
    const initialState = this.getState();
    if (initialState) initialState.map(id => this.Pill({ id, name: id }));
  }

  protected isEmpty(value: string[]): boolean {
    return !value || value.length === 0;
  }
}