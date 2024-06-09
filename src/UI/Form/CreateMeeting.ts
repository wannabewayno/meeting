import { Form, SubmitFn } from "./Form";
import { CreateMeetingUI, CreateMeetingData } from "../Component/CreateMeetingUI";

export function CreateMeetingForm(onSubmit: SubmitFn<CreateMeetingData>) {
    return Form.Factory<CreateMeetingData>(CreateMeetingUI, onSubmit)
}