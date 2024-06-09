import { IService } from "src/Service";
import CreateMeetingProvider, { CreateMeeting } from "./CreateMeeting";
import FindPeopleProvider, { FindAllPeople } from "./FindAllPeople";

export interface IAction {
  CreateMeeting: CreateMeeting;
  FindAllPeople: FindAllPeople;
}

// Infrastructure, Entities, Aggregates That's all this needs.
export type Dependencies = IService;

// Interface for it's dependencies
export default (dependencies: Dependencies): IAction => {
  const CreateMeeting = CreateMeetingProvider(dependencies);
  const FindAllPeople = FindPeopleProvider(dependencies);

  return {
    CreateMeeting,
    FindAllPeople,
  }
};