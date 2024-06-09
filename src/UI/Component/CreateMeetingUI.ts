import { UIComponent } from ".";

// This is where we define the data the form should contain.
export interface CreateMeetingData extends Record<string, any> {
  title: string,
  agenda: string[],
  participants: string[],
}

export class CreateMeetingUI extends UIComponent<CreateMeetingData> {
  constructor(html: HTMLElement) {
    super(html);

    this.addInput('title', { required: true });
    this.addInputList('agenda');
    this.addSearchList('participants', () => namesToSearchableItems(
      'Bronwyn Mechen',
      'Fergal Maher',
      'Alexander Sardo-Infirri',
      'Wayne Griffiths',
      'Sally Tanner',
      'Jason Stannage',
      'James Parker'
      ), { required: true }
    );
  }
}

// Could also export the form here.

function namesToSearchableItems(...names: string[]) {
  return names.map(name => ({
      index: name,
      item: { id: name, name }
  }));
}
