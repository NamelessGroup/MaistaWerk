import Wahlbereich from "./Wahlbereich";

export default interface Modul extends ModuleMetadata {
  id: string;
  name: string;
  verantwortlicher: string;
  link: string;
  wahlbereiche: Wahlbereich[];
}

export interface ModuleMetadata {
  lp: number;
  turnus: string;
  dauer: number;
  sprache: string;
}
