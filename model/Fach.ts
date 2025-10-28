import Wahlbereich from "./Wahlbereich";

export interface SavedFach {
  name: string
}

export default interface Fach extends SavedFach {
  minLP: number;
  maxLP: number;
  wahlbereiche: Wahlbereich[];
}
