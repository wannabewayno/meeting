import type { Dependencies } from '..';
import { IPerson } from 'src/Entities/Person';

export interface IPersonService {
  findPerson: (name: string) => IPerson | null;
  findPeople: (...names: string[]) => IPerson[];
  findAllPeople: () => IPerson[];
  createPerson: (name: string) => Promise<IPerson>;
  upsertPeople: (...names: string[]) => Promise<IPerson[]>;
}

export default ({ Repository }: Dependencies): IPersonService => {
  class PersonService implements IPersonService {

    createPerson(name: string) {
      const person = Repository.Person.create(name);
      return person;
    }

    findPerson(name: string) {
      const [person] = this.findPeople(name);
      return person ?? null;
    }

    findPeople(...names: string[]) {
      return Repository.Person.findByNames(...names);
    }

    findAllPeople() {
      return Repository.Person.findAll();
    }

    async upsertPeople(...names: string[]) {
      const nameSet = new Set(names);
      const people = this.findPeople(...nameSet);
      if (people.length === names.length) return people;

      // Delete all names from nameSet that we know about
      people.forEach(person => {
        nameSet.delete(person.name);
      });

      // Names Set now only has people we need to create.
      // Map through them and create new people
      const createdPeople = await Promise.all([...nameSet].map(name => this.createPerson(name)));
      return createdPeople.concat(people);
    }
  } 

  return new PersonService();
}