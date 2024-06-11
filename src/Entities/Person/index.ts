export interface IPerson {
  firstname: string;
  lastname: string;
  name: string;
  image: string;
  company: string;
  link: string;
  wikiLink: string;
}

export interface IPersonProps {
  image?: string;
  company?: string;
}

export type Person = new (name: string, link: string, props?: IPersonProps) => IPerson;

const DEFAULTS = {
  image: 'https://some-image',
  company: 'Planit',
}

export default () => class Person implements IPerson {
  readonly firstname: string;
  readonly lastname: string;
  readonly image: string;
  readonly company: string;
  readonly link: string

  constructor(name: string, link: string, { image, company }: IPersonProps = {}) {
    const [firstname, ...rest] = name.split(' ');
    this.firstname = firstname;
    this.lastname = rest.join(' ');
    this.link = link;

    this.image = image || DEFAULTS.image;
    this.company = company || DEFAULTS.company;
  }

  get name() {
    return [this.firstname, this.lastname].filter(Boolean).join(' ');
  }

  get wikiLink() {
    return `[[${this.link}|${this.name}]]`;
  }

  toString() {
    return [
      `# ${this.name}`,
    ].join('');
  }
}