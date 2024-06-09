import { Dependencies } from ".";

export type FindAllPeople = () => void

export default ({ Person }: Dependencies) => () => {
  console.log(Person.findAllPeople());
}