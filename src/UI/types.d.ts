export type ID = string;
export type UIData = Record<string, any>;

export interface UIValue {
  id: ID;
  name: string;
  image?: string;
}