import type { App as ObsidianApp } from "obsidian";

interface App extends ObsidianApp {
  commands?: {
    commands: Record<string,any>;
    executeCommandById: (id: string) => void;
  }
}

type Callback = (...args: any[]) => any;

export default (app: App) => {

  class Action extends Function {
    private action: Callback;
    private preHooks: Action[];
    private postHooks: Action[];

    constructor(cb: Callback) {
      super();
      this.action = cb;
      this.preHooks = [];
      this.postHooks = [];

      return new Proxy(this, {
        apply: (target, thisArg, args) => {

          // Run prehooks
          target.preHooks.forEach(hook => hook(...args));

          // Run Action
          const result = target.action(...args);

          // Run Post Hooks
          target.postHooks.forEach(hook => hook(...args));

          return result;
        }
      });
    }

    pre(...actions: Action[]) {
      this.preHooks.push(...actions);

    }

    post(...actions: Action[]) {
      this.postHooks.push(...actions);
    }

    static fromId(id: string) {
      console.log({ Commands: app.commands?.commands });
      app.commands?.executeCommandById(id);
    }
  }

  return Action;
}