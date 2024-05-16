import { HTMLElement } from "happy-dom";
import Fach from "../model/Fach";
import Wahlbereich from "../model/Wahlbereich";

export default function parseFach(node: HTMLElement): Fach {
  const header = node.children[0] as HTMLElement;
  const table = node.children[node.childElementCount - 1] as HTMLTableElement;

  const name = header.children[0].innerHTML.trim();
  const ectsRange = parseECTSRange(header.children[1].children[1].innerHTML);

  return {
    name: name,
    minLP: ectsRange[0],
    maxLP: ectsRange[1],
    wahlbereiche: parseFachTable(table),
  };
}

function parseECTSRange(ectsRangeText: string): [number, number] {
  let ectsRange: [number, number] = [0, 0];
  if (ectsRangeText.includes("-")) {
    const nums = ectsRangeText.split("-").map(Number);
    ectsRange = nums as [number, number];
  } else {
    const num = Number(ectsRangeText);
    ectsRange = [num, num];
  }
  return ectsRange;
}

function parseFachTable(table: HTMLTableElement): Wahlbereich[] {
  const wahlbereiche: Wahlbereich[] = [];
  let rowCandidateCount = table.childElementCount;
  let lastIndex = -1;
  for (let i = 0; i < rowCandidateCount; i++) {
    const child = table.children[i] as HTMLTableRowElement;
    if (child.tagName.toLowerCase() != "tr") continue;
    if (child.childElementCount < 2) {
      const header = child.children[0].innerHTML;
      if (header == "Pflichtbestandteile") {
        let count = 0;
        for (let j = i + 1; j < rowCandidateCount; j++) {
          const child = table.children[i] as HTMLTableRowElement;
          if (child.tagName.toLowerCase() != "tr") continue;
          if (child.childElementCount < 2) break;
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

function parseWahlbereichHeader(header: string) {
  const r = /([^(]+) \(Wahl: ([^)]+)\)/.exec(header);
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

  throw "Could no parse Restrictions: " + wahlbereicheText;
}

function getModulId(row: HTMLTableRowElement) {
  return row.children[0].innerHTML;
}
