export interface IPerson {
  firstname: string;
  lastname: string;
  name: string;
  image: string;
  company: string;
}

export interface IPersonProps {
  image?: string;
  company?: string;
}

export type Person = new (name: string, props?: IPersonProps) => IPerson;

const DEFAULTS = {
  image: 'https://some-image',
  company: 'Planit',
}

export default () => class Person implements IPerson {
  readonly firstname: string;
  readonly lastname: string;
  readonly image: string;
  readonly company: string;

  constructor(name: string, { image, company }: IPersonProps = {}) {
    const [firstname, ...rest] = name.split(' ');
    this.firstname = firstname;
    this.lastname = rest.join(' ');

    this.image = image || DEFAULTS.image;
    this.company = company || DEFAULTS.company;
  }

  get name() {
    return [this.firstname, this.lastname].filter(Boolean).join(' ');
  }
}