import type { App } from 'obsidian';
import EntitiesProvider from '../Entities';
import RepositoryProvider from '../Repository';
import ServiceProvider from 'src/Service';
import ActionProvider, { IAction } from 'src/Action';

export type IContainer = IAction;
export interface Dependencies {
  App: App
}

// TODO: Orchestrate DI through Nested DI Containers
// Each container packs up it's infrastucture through containers
// Then exposes what it needs to, the next container only uses what it can
export default (dependencies: Dependencies) => {
  const Entities = EntitiesProvider();
  const Repository = RepositoryProvider({ Entities, ...dependencies });
  const Service = ServiceProvider({ Repository, ...dependencies });
  const Action = ActionProvider(Service)

  return Action;
}