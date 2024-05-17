import Wahlbereich from "../../model/Wahlbereich";
import {HTMLTableElement} from 'happy-dom'

/**
 * Extracts a list of Wahlbereiche from the table
 */
export default function parseWahlbereicheTable(table: HTMLTableElement): Wahlbereich[] {
  const wahlbereiche: Wahlbereich[] = [];
  let rowCandidateCount = table.childElementCount;
  let lastIndex = -1;
  for (let i = 0; i < rowCandidateCount; i++) {
    const child = table.children[i] as HTMLTableRowElement;
    if (child.tagName.toLowerCase() != "tr") continue;
    if (child.childElementCount < 2) {
      const header = child.children[0].innerHTML;
      if (header == "Pflichtbestandteile") {
        // TODO fix
        let count = 0;
        for (let j = i + 1; j < rowCandidateCount; j++) {
          const child2 = table.children[j] as HTMLTableRowElement;
          if (child2.tagName.toLowerCase() != "tr") continue;
          if (child2.childElementCount < 2) break;
          count++;
        }
        wahlbereiche.push({
          maxBestandteile: count,
          minBestandteile: count,
          maxLP: NaN,
          minLP: NaN,
          modulliste: [],
        });
      } else {
        wahlbereiche.push(parseWahlbereichHeader(header));
      }
      lastIndex++;
    } else {
      wahlbereiche[lastIndex].modulliste.push(getModulId(child));
    }
  }
  return wahlbereiche;
}

/**
 * Parses the header of a wahlbereich and returns the base object of this wahlbereich with the given restrictions
 */
function parseWahlbereichHeader(header: string): Wahlbereich {
  const r = /([^(]+) \(Wahl: ([^)]*)\)/.exec(header);
  if (!r) throw "Could not parse header: " + header;

  const wahlbereich: Wahlbereich = {
    maxBestandteile: NaN,
    minBestandteile: NaN,
    maxLP: NaN,
    minLP: NaN,
    modulliste: [],
  };

  const wahlbereicheText = r[2];
  let limits = /([0-9]+) LP/.exec(wahlbereicheText);
  if (limits) {
    const lp = Number(limits[1]);
    wahlbereich.maxLP = lp;
    wahlbereich.minLP = lp;
    return wahlbereich;
  }

  limits = /([0-9]+) Bestandteil(e)?/.exec(wahlbereicheText);
  if (limits) {
    const bs = Number(limits[1]);
    wahlbereich.maxBestandteile = bs;
    wahlbereich.minBestandteile = bs;
    return wahlbereich;
  }

  limits = /höchstens ([0-9]+) LP/.exec(wahlbereicheText);
  if (limits) {
    const lp = Number(limits[1]);
    wahlbereich.maxLP = lp;
    wahlbereich.minLP = 0;
    return wahlbereich;
  }

  limits = /höchstens ([0-9]+) Bestandteile/.exec(wahlbereicheText);
  if (limits) {
    const bs = Number(limits[1]);
    wahlbereich.maxBestandteile = bs;
    wahlbereich.minBestandteile = 0;
    return wahlbereich;
  }

  limits = /zwischen ([0-9]+) und ([0-9]+) LP/.exec(wahlbereicheText);
  if (limits) {
    const lp1 = Number(limits[1]);
    const lp2 = Number(limits[2]);
    wahlbereich.maxLP = Math.max(lp1, lp2);
    wahlbereich.minLP = Math.min(lp1, lp2);
    return wahlbereich;
  }

  limits = /zwischen ([0-9]+) und ([0-9]+) Bestandteil(e?)/.exec(
    wahlbereicheText
  );
  if (limits) {
    const bs1 = Number(limits[1]);
    const bs2 = Number(limits[2]);
    wahlbereich.maxBestandteile = Math.max(bs1, bs2);
    wahlbereich.minBestandteile = Math.min(bs1, bs2);
    return wahlbereich;
  }
  // TODO: korrekt ects extrahieren evtl.
  if (wahlbereicheText.trim() == '') {
    return wahlbereich
  }

  throw "Could no parse Restrictions: " + wahlbereicheText + " \"" + wahlbereicheText + "\"";
}

/**
 * Gets the id from a table row
 */
function getModulId(row: HTMLTableRowElement) {
  return row.children[0].innerHTML;
}
