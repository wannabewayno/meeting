import { IService } from "src/Service";
import CreateMeetingProvider, { CreateMeeting } from "./CreateMeeting";
import StopMeetingProvider, { StopMeeting } from "./StopMeeting";
import { CreateMeetingForm } from "src/UI/Form/CreateMeeting";

export interface IAction {
  CreateMeeting: CreateMeeting;
  StopMeeting: StopMeeting;
}

// Infrastructure, Entities, Aggregates That's all this needs.
export interface Dependencies {
  CreateMeetingForm: CreateMeetingForm
  Service: IService
};

// Interface for it's dependencies
export default (dependencies: Dependencies): IAction => {
  const CreateMeeting = CreateMeetingProvider(dependencies);
  const StopMeeting = StopMeetingProvider(dependencies);

  return {
    CreateMeeting,
    StopMeeting,
  }
};