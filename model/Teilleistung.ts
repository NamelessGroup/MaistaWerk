export default interface Teilleistung extends TeilleistungMetadata {
  id: string;
  name: string;
  verantwortlicher: string;
}

export interface TeilleistungMetadata {
  teilleistungsart: string;
  lp: number;
  turnus: string;
}
