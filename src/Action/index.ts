import { IService } from "src/Service";
import CreateMeetingProvider, { CreateMeeting } from "./CreateMeeting";

export interface IAction {
  CreateMeeting: CreateMeeting
}

// Infrastructure, Entities, Aggregates That's all this needs.
export type Dependencies = IService;

// Interface for it's dependencies
export default (dependencies: Dependencies): IAction => {
  const CreateMeeting = CreateMeetingProvider(dependencies);

  return {
    CreateMeeting,
  }
};