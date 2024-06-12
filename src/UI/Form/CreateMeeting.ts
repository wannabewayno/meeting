import { Form, SubmitFn } from "./Form";
import { CICreateMeetingUI, CreateMeetingData } from "../Component/CreateMeetingUI";

export type CreateMeetingForm = (onSubmit: SubmitFn<CreateMeetingData>) => (html: HTMLElement, onSubmit?: () => void) => Form<CreateMeetingData>;

export default (CreateMeetingUI: CICreateMeetingUI) => {
    return function CreateMeetingForm(onSubmit: SubmitFn<CreateMeetingData>) {
        return Form.Factory<CreateMeetingData>(CreateMeetingUI, onSubmit)
    }
}