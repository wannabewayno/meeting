import { IRepository } from "src/Repository";
import MeetingServiceProvider, { IMeetingService } from "./MeetingService"
import PersonServiceProvider, { IPersonService } from "./Person"
import ModalProvider, { IModalConstructor } from "./Modal"
import { App } from "obsidian";
import { IInfrastructure } from "src/Container";
import ObsidianServiceProvider, { IObsidianService } from "./Obsidian";

export interface IService {
  MeetingService: IMeetingService,
  Person: IPersonService,
  Modal: IModalConstructor,
  Obsidian: IObsidianService,
}

export interface Dependencies {
  Repository: IRepository;
  Infrastructure: IInfrastructure;
}

// Interface for it's dependencies
export default (dependencies: Dependencies): IService => {
  const Obsidian = ObsidianServiceProvider(dependencies);
  const MeetingService = MeetingServiceProvider({ Obsidian, ...dependencies });
  const Person = PersonServiceProvider(dependencies);
  const Modal = ModalProvider(dependencies);

  return {
    MeetingService,
    Person,
    Modal,
    Obsidian,
  }
};