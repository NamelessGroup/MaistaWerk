import Wahlbereich from "../../../model/Wahlbereich";

export default function isPflichtbereich(wahlbereich: Wahlbereich, f: toLpObjectFunction): boolean {
  const moduleLP = (wahlbereich.modulliste.map(f).map(lp => lp.lp).reduce((a, b) => a + b, 0))
  return wahlbereich.minBestandteile == wahlbereich.modulliste.length && wahlbereich.maxBestandteile == wahlbereich.modulliste.length
    || wahlbereich.minLP == moduleLP && wahlbereich.maxLP == moduleLP
}

interface LPObject {lp: number}
type toLpObjectFunction = ((s: string) => LPObject)