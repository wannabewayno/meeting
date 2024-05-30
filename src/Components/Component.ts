import { Setting, fuzzySearch, prepareFuzzySearch, prepareQuery, FuzzyMatch, sortSearchResults } from "obsidian";

// This should then extend some generic object that knows how to hanlde the data.

// To handle repetitive stuff like this...
// This knows how to aggregate all information, extract it and give it to the callback when done.
// It takes in a list of elements, maps their name to a data object
// sets onChange records to update them and display information if necessary
// comes with a done/submit style button which will extract information and make this available to the modal
// the modal will pass this to any listeners on the onClose() handler.
// Might need a way to register an Action to receive the data afterwards.
// If know 
// class UserInfo {
//   constructor() {

//   }

//   // getData() => {}
// }


// Responsbile for building the thing.
export default class MeetingContext {
  private data: Record<string, any>;

  constructor(html: HTMLElement) {
    // Title
      // Simple text, will be used with a timestamp to make unique

    // Agenda
      // List of items

    // People
      // Who is attending the meeting (display a list with search)

    // Any information about what it does (tooltip).

    // This builds out
    const name = new Setting(html)
    .setName("Name")
    .setTooltip("hello")
    .addText(text => text.setValue(''))

    // console.log(name.setHeading());

    // // This builds out
    // new Setting(html)
    // .setName("Value")
    // .addText(text => text.setValue(''))
    // .addToggle(toggle => toggle);

    new Setting(html).setName("Search").addSearch(search => {
      search.onChange(value => {
        // console.log('Search:', value);
        // const fuzz = prepareFuzzySearch(value);
        // console.log(fuzzySearch(prepareQuery(value), "timbuktoo"));
        // sortSearchResults
      });
    });
  }
  // Need a way to register components.
  // Need a way to extract data
  // N
}