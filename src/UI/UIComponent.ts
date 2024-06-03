import { ButtonComponent, Setting } from "obsidian";
import { FuzzySearch } from "src/Utilities";

enum FormElementType {
  'INPUT',
  'CHOICE',
  'SEARCH',
  'INPUT_LIST',
  'CHOICE_LIST',
  'SEARCH_LIST'
}

type FormData = Record<string, string | string[]>;

interface FormElement {
  type: FormElementType,
  name: string
  hoverText?: string,
  placeholderText?: string,
  defaultValue?: any,
  data?: Record<string, string>,
  required?: boolean,
}

const ENTER = 'Enter';

// This should know how to setup the data attribute.
class UIElement {
  protected readonly setting: Setting;
  private _valid: boolean;
  private readonly required: boolean;
  private readonly name: string;
  private readonly data: Record<string, string | string[]>
  private onValidateCallBack: (isValid: boolean) => void

  constructor(html: HTMLElement, data: Record<string, string | string[]>, opts: Pick<FormElement, 'name' | 'hoverText' | 'defaultValue' | 'required'>) {
    this.data = data;
    this.name = opts.name;
    this.onValidateCallBack = () => {};
    this.required = opts.required ?? true;
    this.setting = new Setting(html);
    this.setting.setName(opts.name);
    if (opts.hoverText) this.setting.setTooltip(opts.hoverText);
    if (this.required) this.setting.setDesc("required");
    this.setData(opts.defaultValue);
  }

  private getData() {
    return this.data[this.name];
  }

  private setData(value: string | string[]) {
    this.data[this.name] = value;

    // Validate the Element.
    this.validate();
  }

  private validate() {
    const data = this.getData();

    if (!data.length && !this.required) {
      this.valid = true;
      return;
    }
    
    // TODO Validate functionality through custom or predefined methods
    this.valid = Boolean(data.length);
  }

  get valid() {
    return this._valid;
  }

  private set valid(valid: boolean) {
    if (this._valid !== valid) {
      this._valid = valid;
      this.onValidateCallBack(valid);
    }
  }

  onValidate(cb: (isValid: boolean) => void) {
    this.onValidateCallBack = cb;
  }

  addData(value: string) {
    const data = this.getData();
    if (Array.isArray(data) && value) this.setData(data.concat(value));
    else this.setData(value);
  }

  removeData(value: string) {
    const data = this.getData();

    // If it's not an array assume we want to clear it.
    if (!Array.isArray(data)) return this.setData('');

    // Otherwise filter the result out.
    this.setData(data.filter(v => v !== value));
  }

  onEnter(el: HTMLElement, cb: () => void) {
    el.on('keypress', 'input', (event: KeyboardEvent) => {
      if (event.code !== ENTER) return;
      cb();
    })
  }
}

class Input extends UIElement {
  constructor(html: HTMLElement, data: FormData, element: FormElement) {
    if (!element.defaultValue) element.defaultValue = '';
    super(html, data, element);

    this.setting.addText(text => {
      text.onChange(value => this.addData(value));
    });
  }
}

class InputList extends UIElement {
  constructor(html: HTMLElement, data: FormData, element: FormElement) {
    element.defaultValue = [];
    super(html, data, element);

    const Pill = PillContainer(html, (text) => this.removeData(text));

    this.setting.addText(text => {

      this.onEnter(text.inputEl, () => {
        const data = text.getValue();
        // Create a UI for the saved data to show to the user as a reminder of what they've entered.
        new Pill(data);

        // Add Data
        this.addData(data);

        text.setValue('');
      });
    });
  }
}

function SearchContainer(html: HTMLElement, onSelect: (value: string) => void) {
  const resultContainer = html.createEl('ul','search-results-container');

  class SearchResult {
    constructor(text: string, image?: string) {
      const container = resultContainer.createEl('li','search-result');

      // Make the SearchResult items focus-able with the keyboard
      container.tabIndex = 0;

      if (image) container.createEl('img', 'search-image');

      container.createSpan('search-text').appendText(text);
      
      container.onClickEvent(() => onSelect(text));
      container.on('keypress', 'li', (event: KeyboardEvent) => event.code === ENTER && onSelect(text))
    }

    static empty() {
      resultContainer.empty();
    }
  }


  return SearchResult;
}


function PillContainer(html: HTMLElement, onRemove: (value: string) => void) {
  const pillContainer = html.createEl('ul','pill-container');

  class Pill {
    constructor(text: string, image?: string) {
      const container = pillContainer.createEl('li','pill');

      // Image (if provided)
      if (image) container.createEl('img', 'pill-image');

      // Text
      container.createSpan('pill-text').appendText(text);

      // Removes the Pill from the DOM and it's underlying FormData
      const removeBtn = container.createEl('button', 'pill-remove')
      removeBtn.appendText('X');
      removeBtn.onClickEvent(() => {
        container.remove();
        onRemove(text);
      });

      return container;
    }
  }

  return Pill;
}

class Choice extends UIElement {
  constructor(html: HTMLElement, data: FormData, element: FormElement) {
    super(html, data, element);

    this.setting.addDropdown(dropdown => {
      if (element.data) dropdown.addOptions(element.data);
    });
  }
}
class ChoiceList extends UIElement {
  constructor(html: HTMLElement, data: FormData, element: FormElement) {
    super(html, data, element);

    this.setting.addDropdown(dropdown => {
      if (element.data) dropdown.addOptions(element.data);
    });
  }
}

class BaseSearch extends UIElement {
  protected currentValue?: HTMLElement;

  constructor(html: HTMLElement, data: FormData, element: FormElement) {
    super(html, data, element);

    // If no data, there's nothing to search and no point in this form, return early.
    if (!element.data) return this;
    const fuzzySearch = FuzzySearch<string>(Object.values(element.data).map(name => ({ item: name, index: name})));

    const Pill = PillContainer(html, (text: string) => this.removeData(text));

    // Set up a container to show the user what they have selected
    this.setting.addSearch(search => {
      const SearchResult = SearchContainer(this.setting.controlEl, (text: string) => {
        SearchResult.empty();
        this.handleSelection(text);
        this.currentValue = new Pill(text) as HTMLElement;
      });

      // TODO: Debounce the search query
      search.onChange(value => {
        SearchResult.empty();
        if (!value) return;
        const results = fuzzySearch(value);
        results.map(result => new SearchResult(result.item));
      });
    });
  }

  // This method will be overridden in derived classes
  protected handleSelection(text: string): string | void {
    throw new Error('handleSelection has not been defined');
  }
}


class Search extends BaseSearch {
  constructor(html: HTMLElement, data: FormData, element: FormElement) {
    super(html, data, element);
  }

  protected handleSelection(text: string): string {
    if (this.currentValue) this.currentValue.remove();
    this.addData(text);
    return text;
  }
}

class SearchList extends BaseSearch {
  constructor(html: HTMLElement, data: FormData, element: FormElement) {
    if (!element.defaultValue || !Array.isArray(element.defaultValue)) element.defaultValue = [];
    super(html, data, element);
  }

  protected handleSelection(text: string): string {
    this.addData(text);
    return text;
  }
}


const FormElementFactory = (html: HTMLElement, data: FormData) => (element: FormElement): UIElement => {
  switch(element.type) {
    case FormElementType.INPUT: return new Input(html, data, element);
    case FormElementType.INPUT_LIST: return new InputList(html, data, element);
    case FormElementType.CHOICE: return new Choice(html, data, element);
    case FormElementType.CHOICE_LIST: return new ChoiceList(html, data, element);
    case FormElementType.SEARCH: return new Search(html, data, element);
    case FormElementType.SEARCH_LIST: return new SearchList(html, data, element);
    default: throw new Error(`Unrecognised type: ${element.type}`) 
  }
}

// This should know how to setup the data attribute.
// Extend Setting, add Validation.
class BaseElement<T> extends Setting {
  private _valid: boolean;
  private readonly required: boolean;
  private readonly name: string;
  private onValidateCallBack: (isValid: boolean) => void
  protected setData: (cb: (currValue: T) => T) => void

  // opts: Pick<FormElement, 'name' | 'hoverText' | 'defaultValue' | 'required'>
  constructor(ui: UIComponent, name: string) {
    super(ui.html);
    this.name = name;
    this.setData = ui.updateValue<T>(name);
    this.onValidateCallBack = () => {};
    this.setName(name);
    // this.required = opts.required ?? true;

    // if (opts.hoverText) this.setTooltip(opts.hoverText);
    // if (this.required) this.setDesc("required");
    // this.setData(() => defaultValue);
  }

  // protected setData<T>(value: T) {
    // Call the function to get the latest data
    // send back the new one.
    // Validate it...

    // Validate the Element.
    // this.validate();
  // }

  // private validate() {
  //   if (!data.length && !this.required) {
  //     this.valid = true;
  //     return;
  //   }
    
  //   // TODO Validate functionality through custom or predefined methods
  //   this.valid = Boolean(data.length);
  // }

  get valid() {
    return this._valid;
  }

  private set valid(valid: boolean) {
    if (this._valid !== valid) {
      this._valid = valid;
      this.onValidateCallBack(valid);
    }
  }

  onValidate(cb: (isValid: boolean) => void) {
    this.onValidateCallBack = cb;
  }

  onEnter(el: HTMLElement, cb: () => void) {
    el.on('keypress', 'input', (event: KeyboardEvent) => {
      if (event.code !== ENTER) return;
      cb();
    })
  }
}

export class TestInput extends BaseElement<string> {
  constructor(ui: UIComponent, name: string) {
    super(ui, name);
    this.addText(text => {
      text.onChange(value => this.setData(() => value));
    });
  }
}

export class UIComponent {
  private data: Record<string, any>;
  readonly html: HTMLElement;
  private elements: UIElement[];

  constructor(html: HTMLElement) {
    this.html = html;
    this.data = {};
    // So we can give each Element something to work with.
    // We can also maybe set the data of the component.
    // Should the elements manipulate the data directly? or give them a way to interact with it?
    // We could provide an updateValue function that takes the current data and returns the new one?

    // Create our Element Factory
    // const formElementFactory = FormElementFactory(html, this.data);

    // Map through elements and mount them.
    // this.elements = Object.entries(elements).map(([name, element]) => formElementFactory({ name, ...element }));
    // const callback = this.updateValue('helllo');
    // this.updateValue<number>('what');
  }

  clearData() {
    this.setData({});
  }

  setData(data: FormData) {
    this.data = data;
  }

  getData(): FormData {
    return this.data;
  }

  // How bout it needing the UIComponent?
  // This is where that Factory comes in handy... OK
  addElement(name: string, element: typeof BaseElement<string>) {
    new TestInput(this, name);
    return this;
    // Mounts the Element.
    // Adds an update data attribute.
  }

  updateValue<T = string>(name: string) {
    return (cb: (currValue: T) => T) => {
      const newValue = cb(this.getValue<T>(name));
      this.setValue<T>(name, newValue)
    };
  }

  // The Part of this is changing
  setValue<T = string>(key: string, value: T) {
    this.data[key] = value;
  }

  getValue<T = string>(key: string): T {
    return this.data[key];
  }
}

// Form can now extend UIComponent and just add a button or two.

export class Form {
  private readonly onSubmit: (data: FormData) => any;
  private submitButton: ButtonComponent;

  constructor(html: HTMLElement, heading: string, elements: Record<string, Omit<FormElement, 'name'>>, onSubmit: (data: FormData) => any) {
    this.data = {};
    this.onSubmit = onSubmit;

    html.createEl('h2').appendText(heading);

    // Create our Element Factory
    const formElementFactory = FormElementFactory(html, this.data);

    // Map through elements => mount them via factory => return mapping of names to mounted elements
    this.formElements = Object.fromEntries(
      Object
      .entries(elements)
      .map(([name, element]) => {
        const el = formElementFactory({ name, ...element });
        el.onValidate(() => this.canSubmit());
        return [name, el];
      })
    );

    this.addSubmitButton(html);
  }

  private addSubmitButton(html: HTMLElement) {
    new Setting(html).addButton(submitButton => {
      this.submitButton = submitButton;
      submitButton.setButtonText('Ok');
      this.canSubmit();
      submitButton.onClick(() => this.submit());
    });
  }

  private isFormValid() {
    return !Object.values(this.formElements).some(element => !element.valid);
  }

  private canSubmit() {
    if (this.isFormValid()) this.enableSubmitButton();
    else this.disableSubmitButton();
  }

  private enableSubmitButton() {
    this.submitButton.setCta().setDisabled(false);
  }

  private disableSubmitButton() {
    this.submitButton.removeCta().setDisabled(true);
  }

  submit() {
    console.log("Submitting");

    // Pass the Data to the Action when Submiting the form.
    this.onSubmit(this.data);
  }
}

export interface IForm {
  html: HTMLElement;
  onSubmit: (data: FormData) => void;
}

export default class MeetingContext extends Form {
  constructor(html: HTMLElement, onSubmit: (data: FormData) => void) {
    super(html, "New Meeting", {
      Title: {
        type: FormElementType.INPUT,
      },
      People: {
        type: FormElementType.SEARCH_LIST,
        data: {
          Bron: 'Bronwyn',
          Fergal: 'Fergal',
        }
      },
      Agenda: {
        type: FormElementType.INPUT_LIST,
        required: false,
      },
    }, onSubmit);
  }
}