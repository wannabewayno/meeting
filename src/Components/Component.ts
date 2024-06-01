import { Setting } from "obsidian";
import { FuzzySearch } from "src/Utilities";

enum FormElementType {
  'INPUT',
  'CHOICE',
  'SEARCH',
  'INPUT_LIST',
  'CHOICE_LIST',
  'SEARCH_LIST'
}

type FormData = Record<string, any>;

interface FormElement {
  type: FormElementType,
  name: string
  hoverText?: string,
  placeholderText?: string,
  defaultValue?: any,
  data?: Record<string, string>,
}

// This should know how to setup the data attribute.
class Element {
  public readonly setting: Setting;
  private readonly name: string;
  private readonly data: Record<string, string|string[]>

  constructor(html: HTMLElement, data: Record<string, any>, opts: Pick<FormElement, 'name' | 'hoverText' | 'defaultValue'>) {
    this.data = data;
    this.name = opts.name;
    this.setting = new Setting(html);
    this.setting.setName(opts.name);
    if (opts.hoverText) this.setting.setTooltip(opts.hoverText);
    this.setData(opts.defaultValue);
  }

  setData(value: string|string[]) {
    this.data[this.name] = value;
  }

  addData(value: any) {
    let data = this.data[this.name];
    if (!Array.isArray(data)) return;
    this.data[this.name] = data.concat(value);
  }

  removeData(value: any) {
    const data = this.data[this.name];
    if (!Array.isArray(data)) return;
    this.data[this.name] = data.filter(v => v === value);
  }

  onEnter(el: HTMLElement, cb: () => void) {
    el.on('keypress', 'input', (event: KeyboardEvent) => {
      if (event.code !== ENTER) return;
      cb();
    })
  }
}

const ENTER = 'Enter';

class Input extends Element {
  constructor(html: HTMLElement, data: Record<string, any>, element: FormElement) {
    if (!element.defaultValue) element.defaultValue = '';
    super(html, data, element);
    this.setting.addText(text => {
      text.onChange(value => this.setData(value));
    });
  }
}

class InputList extends Element {
  private currentValue: string;

  constructor(html: HTMLElement, data: Record<string, any>, element: FormElement) {
    element.defaultValue = [];
    super(html, data, element);
    this.currentValue = '';

    const Pill = PillContainer(html, (text) => this.removeData(text));

    this.setting.addText(text => {

      text.onChange(value => {
        this.currentValue = value;
      });

      this.onEnter(text.inputEl, () => {
        // Create a UI for the saved data to show to the user as a reminder of what they've entered.
        new Pill(this.currentValue);

        // Add Data
        this.addData(this.currentValue);

        // Clear The value
        this.currentValue = '';
        text.setValue('');
      });
    });
  }
}

function SearchContainer(html: HTMLElement, add: (value: string) => void) {
  const pillContainer = html.createEl('ul','search-results-container');

  class SearchResult {
    constructor(text: string, image?: string) {
      const container = pillContainer.createEl('li','search-result');
      if (image) container.createEl('img', 'search-image');

      container.createSpan('search-text').appendText(text);
      
      container.onClickEvent(() => add(text));
    }

    static empty() {
      pillContainer.empty();
    }
  }


  return SearchResult;
}


/*
  Must have the ability to remove itself
*/
function PillContainer(html: HTMLElement, removeData: (value: string) => void) {
  const pillContainer = html.createEl('ul','pill-container');

  class Pill {
    constructor(text: string, image?: string) {
      const container = pillContainer.createEl('li','pill');
      if (image) container.createEl('img', 'pill-image');

      container.createSpan('pill-text').appendText(text);
      const removeBtn = container.createEl('button', 'pill-remove')
      removeBtn.appendText('X');
      removeBtn.onClickEvent(() => {
        container.remove();
        removeData(text);
      });

      return container;
    }
  }

  return Pill;
}

class Choice extends Element {
  constructor(html: HTMLElement, data: Record<string, any>, element: FormElement) {
    super(html, data, element);

    this.setting.addDropdown(dropdown => {
      if (element.data) dropdown.addOptions(element.data);
    });
  }
}
class ChoiceList extends Element {
  constructor(html: HTMLElement, data: Record<string, any>, element: FormElement) {
    super(html, data, element);

    this.setting.addDropdown(dropdown => {
      if (element.data) dropdown.addOptions(element.data);
    });
  }
}

class Search extends Element {
  private currentValue?: HTMLElement;

  constructor(html: HTMLElement, data: Record<string, any>, element: FormElement) {
    super(html, data, element);
    if (!element.data) return this;

    const Pill = PillContainer(this.setting.controlEl, () => this.setData(''));
    const fuzzySearch = FuzzySearch(Object.values(element.data));
    const SearchResult = SearchContainer(this.setting.controlEl, (text: string) => {
      if (this.currentValue) this.currentValue.remove();
      this.setData(text);
      this.currentValue = new Pill(text) as HTMLElement;
      SearchResult.empty();
    });

    this.setting.addSearch(search => {
      /*
       TODO: Debounce the search query
      */
      search.onChange(value => {
        SearchResult.empty();
        if (!value) return;
        const results = fuzzySearch(value);
        results.map(result => new SearchResult(result.item));
      });
    });
  }
}

class SearchList extends Element {
  constructor(html: HTMLElement, data: Record<string, any>, element: FormElement) {
    super(html, data, element);
    if (!element.data) return this;

    const Pill = PillContainer(html, (text) => this.removeData(text));
    const SearchResult = SearchContainer(this.setting.controlEl, (text: string) => {
      this.addData(text);
      new Pill(text);
    });

    const fuzzySearch = FuzzySearch(Object.values(element.data));

    this.setting.addSearch(search => {
      /*
       TODO: Debounce the search query
      */
      search.onChange(value => {
        SearchResult.empty();
        if (!value) return;
        const results = fuzzySearch(value);
        results.map(result => new SearchResult(result.item));
      });
    });
  }
}

const FormElementFactory = (html: HTMLElement, data: FormData) => (element: FormElement): Element => {
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

class UserInfo {
  private readonly data: Record<string,any>;

  constructor(html: HTMLElement, elements: Record<string, Omit<FormElement, 'name'>>) {
    this.data = {};
    html.createEl('br');
    const formElementFactory = FormElementFactory(html, this.data);

    Object.entries(elements).forEach(([name, element]) => formElementFactory({ name, ...element }))
  }

  getData() {
    return this.data;
  }
}


// Responsbile for building the thing.
export default class MeetingContext {
  private info: UserInfo;
  /*
    1. Build utility function that finds all files with the frontmatter.tags as People.
    2. Run and cache at startup as "People"
    3. Have a listener that when a new note is created if it's a Person, add it to the list
    4. When a person's note is modified, update them in the list.
  */
  constructor(html: HTMLElement) {
    this.info = new UserInfo(html, {
      Title: {
        type: FormElementType.INPUT,
      },
      Agenda: {
        type: FormElementType.INPUT_LIST,
      },
      People: {
        type: FormElementType.SEARCH,
        data: {
          Bron: 'Bronwyn',
          Fergal: 'Fergal',
        }
      },
      Choice: {
        type: FormElementType.SEARCH_LIST,
        data: {
          Bron: 'Bronwyn',
          Fergal: 'Fergal',
        }
      }
    });
  }

  getData() {
    return this.info.getData();
  }

  // Need a way to extract data
  // If the MeetingContext extended the UserInfo as it's a type of user info.
}