import { Dependencies } from ".";

export type StopMeeting = () => void

export default ({ Service }: Dependencies) => async () => {
    await Service.MeetingService.stopMeeting();
}