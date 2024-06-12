import { IService } from "src/Service";
import { UIComponent } from ".";


// This is where we define the data the form should contain.
export interface CreateMeetingData extends Record<string, any> {
  title: string;
  agenda: string[];
  participants: string[];
}


export type Dependencies = IService
export type CICreateMeetingUI = typeof UIComponent<CreateMeetingData>
export type ICreateMeetingUI = UIComponent<CreateMeetingData>
export type CreateMeetingUIProvider = (Service: Dependencies) => CICreateMeetingUI;

export default (Service: Dependencies): CICreateMeetingUI => {
  const searchablePeople = () => Service.Person.findAllPeople().map(({ name }) => nameToSearchableItem(name));

  return class CreateMeetingUI extends UIComponent<CreateMeetingData> {
    constructor(html: HTMLElement) {
      super(html);

      this.addInput('title', { required: true });
      this.addInputList('agenda');
      this.addSearchList('participants', searchablePeople, { required: true });
    }
  }
}

function nameToSearchableItem(name: string) {
  return {
    index: name,
    item: { id: name, name }
  };
}
