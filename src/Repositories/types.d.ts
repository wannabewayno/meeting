import { App } from "obsidian"
import { Entities } from "src/Entities"

// Infrastructure, Entities, Aggregates That's all this needs.
export interface Dependencies {
  App: App; // Infrastructure (i.e our Plugin (or anything else, we could expose this as Infrastructure...))
  Entities: Entities;
  // Aggregates: Aggregates;
  // Infrastructure: Infrastructure;
}