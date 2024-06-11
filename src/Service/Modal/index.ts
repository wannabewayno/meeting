import { Dependencies } from "..";
import Modal from "src/UI/Modal";
export type { IModalConstructor } from "src/UI/Modal";

export default ({ Infrastructure }: Dependencies) => Modal(Infrastructure);