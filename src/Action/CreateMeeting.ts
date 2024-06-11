import { Dependencies } from ".";
import { CreateMeetingForm } from "src/UI/Form/CreateMeeting";

export type CreateMeeting = () => void

export default ({ MeetingService, Person, Modal }: Dependencies) => {

  // Prepare our Meeting form by providing a handler that executes when the form is submitted
  const creatingMeetingForm = CreateMeetingForm(async data => {
    const participants = await Person.upsertPeople(...data.participants);

    // Create the meeting with this data.
    await MeetingService.createMeeting(
      data.title,
      participants,
      data.agenda,
    )
  })
  
  // Return an Action that when called opens a Modal with our Meeting form.
  return () => Modal.Open(creatingMeetingForm);
}