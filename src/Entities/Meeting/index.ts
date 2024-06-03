import { IPerson } from "../Person";

export interface IMeeting {
  id: string,
  title: string,
  participants: IPerson[],
  startedAt: Date,
  endedAt: Date | null
  agenda: string[],
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
  readonly endedAt: Date | null;
  readonly agenda: string[];
  readonly participants: IPerson[];

  constructor({ title, startedAt, endedAt, participants, agenda }: IMeetingProps) {
    this.id = 'meetingId'// GenerateId Some form of value object no doubt.
    this.title = title;
    this.startedAt = startedAt || new Date();
    this.endedAt = endedAt || null;
    this.agenda = agenda || [];
    this.participants = participants;
  }
}