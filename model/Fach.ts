import Wahlbereich from "./Wahlbereich";

export default interface Fach {
  name: string;
  minLP: number;
  maxLP: number;
  wahlbereiche: Wahlbereich[];
}
