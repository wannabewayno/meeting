import { Dependencies } from ".";

export type CreateMeeting = () => void

export default ({ MeetingService }: Dependencies) => () => {
  console.log("Creating a new Meeting!");
  // Use Services together to create a meaningful action.
  // Prepare Information for a Meeting Modal.

  // Open a Modal for the User to input information.
  
  // On Submit it should call MeetingService.CreateMeeting
}