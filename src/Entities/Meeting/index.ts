import { IPerson } from "../Person";

export interface IMeeting {
  id: string,
  title: string,
  participants: IPerson[],
  startedAt: Date,
  endedAt: Date | null
  agenda: string[],
  link: string,
  wikiLink: string,

  toString: () => string;
}

export interface IMeetingProps {
  title: string,
  participants: IPerson[],
  startedAt?: Date,
  endedAt?: Date
  agenda?: string[],
}

export type Meeting = new (props: IMeetingProps) => IMeeting;

export default () => class Meeting implements IMeeting {
  readonly id: string;
  readonly title: string;
  readonly startedAt: Date;
  endedAt: Date | null;
  readonly agenda: string[];
  readonly participants: IPerson[];
  link: string;

  constructor({ title, startedAt, endedAt, participants, agenda }: IMeetingProps) {
    this.id = (Date.now() / 1000).toFixed(0);
    this.title = title;
    this.startedAt = startedAt || new Date();
    this.endedAt = endedAt || null;
    this.agenda = agenda || [];
    this.participants = participants;
  }

  get wikiLink() {
    return `[[${this.link}|${this.title}]]`
  }

  toString() {
    return [
      `# ${this.title}\n**Start:** ${this.startedAt}\n**End:** ${this.endedAt || '{{endedAt}}'}\n**Duration:** {{duration}}`,
      `\n## Agenda${this.toMarkdownList(...this.agenda)}`,
      `\n## Participants${this.toMarkdownList(...this.participants.map(person => person.wikiLink))}`,
      `\n## Action Items`,
      `\n## Summary`,
      `\n## Notes`,
    ].join('\n');
  }

  toMarkdownList(...items: string[]) {
    return items.reduce((string, item) => string += `\n- ${item}`, '');
  }
}