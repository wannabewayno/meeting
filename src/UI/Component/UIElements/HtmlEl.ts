import { UIValue } from "../../types";
import { ENTER } from "./BaseElement";

export type Pill = (item: UIValue) => HTMLElement

export function PillContainer(html: HTMLElement, onRemove: (value: string) => void): Pill {
  const pillContainer = html.createEl('ul','pill-container');

  function Pill(item: UIValue) {
    const container = pillContainer.createEl('li','pill');

    // Image (if provided)
    if (item.image) container.createEl('img', 'pill-image');

    // Text
    container.createSpan('pill-text').appendText(item.name);

    // Removes the Pill from the DOM and it's underlying FormData
    const removeBtn = container.createEl('button', 'pill-remove')
    removeBtn.appendText('X');
    removeBtn.onClickEvent(() => {
      focusNextAvailableElement(container);
      container.remove();
      onRemove(item.id);
    });

    return container;
  }
  
  return Pill;
}

function focusPreviousSibling(element: HTMLElement): boolean {
   const sibling = findPreviousFocusableSibling(element);
   if (!sibling) return false;

   let focusableEl: HTMLButtonElement | HTMLInputElement | null;
   focusableEl = sibling.querySelector('button');
   if (!focusableEl) focusableEl = sibling.querySelector('input');
   if (!focusableEl) return false;

   focusableEl.focus();
   return true;
}

function focusNextAvailableElement(element: HTMLElement) {
    const didFocus = focusPreviousSibling(element);
    if (didFocus) return;
    if (!element.parentElement) return;
    focusNextAvailableElement(element.parentElement);
}

function findPreviousFocusableSibling(element: HTMLElement) {
    if (element.previousElementSibling) return element.previousElementSibling;
    else return element.nextElementSibling;
}

export function SearchContainer(html: HTMLElement, onSelect: (item: UIValue) => void) {
    const resultContainer = html.createEl('ul','search-results-container');
  
    class SearchResult {
      constructor(result: UIValue) {
        const container = resultContainer.createEl('li','search-result');
  
        // Make the SearchResult items focus-able with the keyboard
        container.tabIndex = 0;
  
        if (result.image) container.createEl('img', 'search-image');
  
        container.createSpan('search-text').appendText(result.name);
        
        // Allows Clicking on List item to add select it.
        container.onClickEvent(() => onSelect(result));
        // Allows hitting Enter via keyboard navigation to select it.
        container.on('keypress', 'li', (event: KeyboardEvent) => event.code === ENTER && onSelect(result))
      }
  
      static empty() {
        resultContainer.empty();
      }
    }
  
    return SearchResult;
}