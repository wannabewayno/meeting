import { Setting } from 'obsidian';
import { UIComponent, UIEvents } from "..";
import { capitalize } from '../../Services/Text';
import { EventEmitter } from 'stream';

export interface UIElementOpts<T> {
  hoverText?: string,
  placeholderText?: string,
  required?: boolean,
  description?: string,
  validator?: (currValue: T) => boolean, // If returns a truthy value... it means it did not pass validation., if truthy value is a string, use this as the warning message
}

export const ENTER = 'Enter';

type SetState<T> = (cb: (currValue?: T) => T) => void;
type GetState<T> = () => T

export abstract class BaseElement<T> extends Setting implements EventEmitter {
  private _valid: boolean;
  readonly name: string;
  private readonly required: boolean;

  // Validates the information in the element.
  private readonly validator: (currValue: T) => boolean;

  protected getState: GetState<T>;
  protected setState: SetState<T>;

  constructor(ui: UIComponent<any>, name: string, opts: UIElementOpts<T> = {}) {
    super(ui.html);

    this.name = name;
    this.validator = opts.validator ?? (() => false);
    
    const [getState, setState] = ui.useState<string>(name);
    this.getState = getState;
    this.setState = this.useValidate(setState);

    this.setName(capitalize(name).trim());
    this.required = opts.required ?? false;
    this.valid = !this.required;

    if (opts.hoverText) this.setTooltip(opts.hoverText);
    if (this.required) opts.description = (opts.description ?? '') + " (required)";
    if (opts.description) this.setDesc(opts.description.trim());
  }

  /**
   * Acts as a passive state pass-through.
   * Intercepts the new state and validates it before sending it back through.
   * @param setState 
   * @returns 
   */
  private useValidate(setState: SetState<T>): SetState<T> {
    return (cb: (currValue?: T) => T) => {
      setState(currValue => {
        const newValue = cb(currValue);
        this.validate(newValue);
        return newValue;
      });
    };
  }

  get valid() {
    return this._valid;
  }

  private set valid(valid: boolean) {
    if (this._valid === valid) return;
    this._valid = valid;
    this.emit(UIEvents.VALIDATE, valid);
  }

  private validate(value: T): void {
    /*
      Stage 1: If field is marked as required and it's empty.
      invalidate it.
    */
    if (this.isEmpty(value) && this.required) this.valid = false;
    /*
      Stage 2: Validate it
    */
    else this.valid = !this.validator(value);
  }

  protected abstract isEmpty(value: T): boolean
  abstract refreshState(): void

  protected onEnter(el: HTMLElement, cb: () => void) {
    el.on('keypress', el.tagName, (event: KeyboardEvent) => {
      if (event.code !== ENTER) return;
      cb();
    })
  }

  // EventEmitter methods to be implemented
  addListener: (event: string | symbol, listener: (...args: any[]) => void) => this;
  on: (event: string | symbol, listener: (...args: any[]) => void) => this;
  once: (event: string | symbol, listener: (...args: any[]) => void) => this;
  removeListener: (event: string | symbol, listener: (...args: any[]) => void) => this;
  off: (event: string | symbol, listener: (...args: any[]) => void) => this;
  removeAllListeners: (event?: string | symbol) => this;
  setMaxListeners: (n: number) => this;
  getMaxListeners: () => number;
  listeners: (event: string | symbol) => Function[];
  rawListeners: (event: string | symbol) => Function[];
  emit: (event: string | symbol, ...args: any[]) => boolean;
  listenerCount: (type: string | symbol) => number;
  prependListener: (event: string | symbol, listener: (...args: any[]) => void) => this;
  prependOnceListener: (event: string | symbol, listener: (...args: any[]) => void) => this;
  eventNames: () => (string | symbol)[];
}

Object.assign(BaseElement.prototype, EventEmitter.prototype);