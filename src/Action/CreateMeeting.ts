import { Dependencies } from ".";

export type CreateMeeting = () => void

export default ({ CreateMeetingForm, Service: { MeetingService, Person, Modal } }: Dependencies) => {

  // Prepare our Meeting form by providing a handler that executes when the form is submitted
  const creatingMeetingForm = CreateMeetingForm(async data => {
    const participants = await Person.upsertPeople(...data.participants);

    // Create the meeting with this data.
    const meeting = await MeetingService.createMeeting(
      data.title,
      participants,
      data.agenda,
    )

    // TODO: Update the UI with a Status Bar to show an active meeting.
    // This should be handled via an event (i.e on any active meeting).
    // Will also give us a chance to respond to events.
    // We'll need to emit out "active meeting"
    // And have the UI respond to this event.
    // That might be a better course of action.
  })
  
  // Return an Action that when called opens a Modal with our Meeting form.
  return () => Modal.Open(creatingMeetingForm);
}