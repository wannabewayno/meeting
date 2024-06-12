import { EventEmitter } from "stream";
import type { UIValue, ID } from "../types";
import { BaseElement, Input, InputList, Choice, Search, SearchList, Switch } from "./UIElements";
import { UIElementOpts, SearchableItem } from "./UIElements/types";

export enum UIEvents {
  VALIDATE = 'VALIDATE'
}

export class UIComponent<T extends Record<string, any>> extends EventEmitter {
  readonly html: HTMLElement;
  private data: T;
  private heading: HTMLHeadingElement;
  private readonly elements: BaseElement<any>[];
  private _isValid: boolean;

  constructor(html: HTMLElement) {
    super();
    this.html = html;
    this.elements = [];
    this.clearData();
  }

  clearData() {
    this.setData({} as T);
    return this;
  }

  setData(data: T) {
    this.data = data;
    this.elements.forEach(element => element.refreshState());
    return this;
  }

  getData(): T {
    return this.data;
  }

  setHeading(text: string) {
    if (this.heading) this.heading.remove();
    this.heading = this.html.createEl('h2', { prepend: true });
    this.heading.appendText(text);
    return this;
  }

  private addElement(element: BaseElement<any>) {
    // Push element into list of known elements
    this.elements.push(element);

    // Attach listeners to element
    // List for VALIDATION Events and re-check elements.
    element.on(UIEvents.VALIDATE, () => {
      this.isValid = !this.elements.some(element => !element.valid);
    });
    return this;
  }

  addInput<K extends keyof T = string>(name: K, opts?: UIElementOpts<T[K]>): Input {
    const el = new Input(this, name as string, opts);
    this.addElement(el);
    return el;
  }
  addInputList<K extends keyof T = string>(name: K, opts?: UIElementOpts<string[]>): InputList {
    const el = new InputList(this, name as string, opts);
    this.addElement(el);
    return el;
  }
  addChoice<K extends keyof T = string>(name: K, loadData: () => UIValue[], opts?: UIElementOpts<string>): Choice {
    const el = new Choice(this, name as string, loadData, opts);
    this.addElement(el);
    return el;
  }
  addSearch<K extends keyof T = string>(name: K, loadData: () => SearchableItem<UIValue>[], opts?: UIElementOpts<ID>): Search {
    const el = new Search(this, name as string, loadData, opts);
    this.addElement(el);
    return el;
  }
  addSearchList<K extends keyof T = string>(name: K, loadData: () => SearchableItem<UIValue>[], opts?: UIElementOpts<ID[]>): SearchList {
    const el = new SearchList(this, name as string, loadData, opts);
    this.addElement(el);
    return el;
  }
  addSwitch<K extends keyof T = string>(name: K, opts?: UIElementOpts<boolean>): Switch {
    const el = new Switch(this, name as string, opts);
    this.addElement(el);
    return el;
  }

  /**
   * Generate a set of functions for:
   * Retrieving Current State
   * Updating The State
   * @param name 
   * @returns {Array}
   */
  useState<K extends keyof T = string>(name: K): [
    () => T[K],
    (cb: (currValue: T[K]) => T[K]) => void,
  ] {
    return [
      () => this.getValue(name),
      (cb) => {
        const newValue = cb(this.getValue(name));
        this.setValue(name, newValue)
      }, 
    ]
  }

  // Check 'valid' status of all elements.
  get isValid() {
    return this._isValid;
  }

  private set isValid(valid: boolean) {
    if (this._isValid === valid) return;
    this._isValid = valid;
    this.emit(UIEvents.VALIDATE, valid);
  }

  protected setValue<K extends keyof T>(key: K, value?: T[K]) {
    this.data[key] = value!;
  }

  protected getValue<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
}
