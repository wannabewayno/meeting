import { UIComponent } from "..";
import { BaseElement } from "./BaseElement";
import { UIValue } from "../../types";
import { UIElementOpts } from "./BaseElement";
import { DropdownComponent } from "obsidian";

export class Choice extends BaseElement<string> {
  private dropdown: DropdownComponent;

  constructor(ui: UIComponent<any>, name: string, loadData: () => UIValue[], opts: UIElementOpts<string> = {}) {
    super(ui, name, opts);

    this.addDropdown(dropdown => {
      this.dropdown = dropdown;

      // Set options for user to choose from
      const dropdownData = loadData();
      dropdownData.forEach(UIValue => {
        dropdown.addOption(UIValue.id, UIValue.name);
      });

      this.refreshState();
      
      // Setup an onChange listener to update the value.
      dropdown.onChange(value => {
        this.setState(() => value);
      });
    });
  }

  refreshState(): void {
    // Set initial state if there is one.
    const initialState = this.getState();
    this.dropdown.setValue(initialState);
  }

  protected isEmpty(value: string): boolean {
    return !value;
  }
}