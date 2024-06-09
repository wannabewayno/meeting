import type { Dependencies } from '..';
import { IPerson } from 'src/Entities/Person';

export interface IPersonService {
  // findPerson: (name: string) => IPerson | null;
  findPeople: (...names: string[]) => IPerson[];
  findAllPeople: () => IPerson[];
}

export default ({ Repository }: Dependencies): IPersonService => {
  class PersonService implements IPersonService {

    findPeople(...names: string[]) {
      return Repository.Person.findByNames(...names);
    }

    findAllPeople() {
      return Repository.Person.findAll();
    }
  } 

  return new PersonService();
}