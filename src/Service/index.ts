import { IRepository } from "src/Repository";
import MeetingServiceProvider, { IMeetingService } from "./MeetingService"
import PersonServiceProvider, { IPersonService } from "./Person"
import ModalProvider, { IModalConstructor } from "src/UI/Modal"
import { App } from "obsidian";

export interface IService {
  MeetingService: IMeetingService,
  Person: IPersonService,
  Modal: IModalConstructor,
}

// Infrastructure, Entities, Aggregates That's all this needs.
export interface Dependencies {
  Repository: IRepository
  App: App
}

// Interface for it's dependencies
export default (dependencies: Dependencies): IService => {
  const MeetingService = MeetingServiceProvider(dependencies);
  const Person = PersonServiceProvider(dependencies);
  const Modal = ModalProvider(dependencies);

  return {
    MeetingService,
    Person,
    Modal,
  }
};