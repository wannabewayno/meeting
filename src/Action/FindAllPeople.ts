import { Dependencies } from ".";

export type FindAllPeople = () => void

export default ({ Person, Obsidian }: Dependencies) => () => {
  Obsidian.getPlugin('')
}