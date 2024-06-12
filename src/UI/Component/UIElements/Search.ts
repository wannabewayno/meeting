import type { UIComponent } from "..";
import { PillContainer, SearchContainer, Pill } from "./HtmlEl";
import { BaseElement, UIElementOpts } from "./BaseElement";
import { UIValue, ID } from "../../types";
import { CreateFuzzySearch, SearchableItem } from "../../Services/Search";

// Common Exports
export type { SearchableItem } from '../../Services/Search';

abstract class BaseSearch<T> extends BaseElement<T> {
    protected Pill: Pill;

    constructor(ui: UIComponent<any>, name: string, loadData: () => SearchableItem<UIValue>[], opts: UIElementOpts<T> = {}) {
      super(ui, name, opts);
  
      // Load the Data
      const searchData = loadData();
  
      // Create a fuzzySearch for our data
      const fuzzySearch = CreateFuzzySearch<UIValue>(searchData);
  
      // Intialize our "Pill" Element.
      // This will be a container to show the user what they have selected.
      this.Pill = PillContainer(ui.html, (value: string) => this.handleRemoval(value));
  
      this.refreshState();
  
      this.addSearch(search => {
        const SearchResult = SearchContainer(this.controlEl, (item: UIValue) => {
          SearchResult.empty();
          this.handleSelection(item.id);
          this.updateLatestSelection(item);
          search.setValue('');
          search.inputEl.focus();
        });
  
        // TODO: Debounce the search query
        search.onChange(value => {
          SearchResult.empty();
          if (!value) return;
          const results = fuzzySearch(value);
          if (!results.length) results.push({ match: { matches:[], score: 0 }, item: { id: value, name: `New: ${value}` } });
          results.map(({ item }) => new SearchResult(item));
        });

        // Hitting "Enter" on the input will just add the first highlighted item in the array.
        this.onEnter(search.inputEl, () => SearchResult.clickFirstElement());
      });
    }
  
    abstract refreshState(): void;
    protected abstract updateLatestSelection(item: UIValue): void;
    protected abstract handleSelection(itemId: ID): void;
    protected abstract handleRemoval(itemId: ID): void;
    protected abstract isEmpty(value: T): boolean;
  }
  
export class Search extends BaseSearch<ID> {
    protected latestSelection: HTMLElement;
  
    refreshState(): void {
      const initialState = this.getState();
      if (initialState) this.latestSelection = this.Pill({ id: initialState, name: initialState }) as HTMLElement;
    }
  
    protected updateLatestSelection(item: UIValue): void {
      if (this.latestSelection) this.latestSelection.remove();
      this.latestSelection = this.Pill(item);
    }
  
    protected handleSelection(itemId: ID): void {
      if (this.latestSelection) this.latestSelection.remove();
      this.setState(() => itemId);
    }
  
    protected handleRemoval(): void {
      this.setState(() => '');
    }

    protected isEmpty(value: string): boolean {
      return !value;
    }
}
  
export class SearchList extends BaseSearch<ID[]> {
    refreshState(): void {
      const initialState = this.getState();
      if (initialState) initialState.map(id => this.Pill({ id, name: id })) as HTMLElement[];
    }
  
    protected updateLatestSelection(item: UIValue): void {
      this.Pill(item);
    }
  
    protected handleSelection(itemId: ID): void {
      if (!itemId) return;
      this.setState(ids => ids ? ids.concat(itemId) : [itemId]);
    }
  
    protected handleRemoval(itemId: ID): void {
      this.setState(ids => ids ? ids.filter(id => id !== itemId) : []);
    }

    protected isEmpty(value: string[]): boolean {
      return !value || value.length === 0;
    }
}