import { Dependencies } from ".";
// import { CreateMeetingData } from "src/UI/Component/CreateMeetingUI";
import { CreateMeetingForm } from "src/UI/Form/CreateMeeting";

export type CreateMeeting = () => void

export default ({ MeetingService, Person, Modal }: Dependencies) => {
  const creatingMeetingForm = CreateMeetingForm(data => {

    // Parse peoples names Structured data.
    const participants = Person.findPeople(...data.participants);

    // Having a Create People (from Names) would be a handy Service Method to Have :D
    console.log({ participants });

    // Create the meeting with this data.
    MeetingService.createMeeting(
      data.title,
      participants,
      data.agenda,
    )
  })
  
  // Return an Action that when called opens a Modal with our Meeting form.
  // On Submit it will parse the form's data and create the meeting.
  return () => Modal.Open(creatingMeetingForm);
}