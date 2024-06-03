import { IRepository } from "src/Repository";
import MeetingServiceProvider, { IMeetingService } from "./MeetingService"

export interface IService {
  MeetingService: IMeetingService
}

// Infrastructure, Entities, Aggregates That's all this needs.
export interface Dependencies {
  Repository: IRepository
}

// Interface for it's dependencies
export default (dependencies: Dependencies): IService => {
  const MeetingService = MeetingServiceProvider(dependencies);

  return {
    MeetingService
  }
};