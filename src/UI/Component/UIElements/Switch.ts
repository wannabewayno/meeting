import { BaseElement } from "./BaseElement";
import type { UIComponent } from "..";
import type { UIElementOpts } from "./BaseElement";
import { ToggleComponent } from "obsidian";

export class Switch extends BaseElement<boolean> {
    private toggleEl: ToggleComponent;

    constructor(ui: UIComponent<any>, name: string, opts: UIElementOpts<boolean> = {}) {
      super(ui, name, opts);
  
      this.addToggle(toggle => {
        this.toggleEl = toggle;
        this.refreshState();
  
        // Set onChange to update our state.
        toggle.onChange(value => this.setState(() => value));
      });
    }

    refreshState(): void {
      this.toggleEl.setValue(this.getState());
    }
    
    protected isEmpty(value: boolean): boolean {
      return !value;
    }
}