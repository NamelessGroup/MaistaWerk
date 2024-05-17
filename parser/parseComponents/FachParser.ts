import { HTMLElement } from "happy-dom";
import Fach from "../../model/Fach";
import parseWahlbereicheTable from "./WahlbereicheParser";

export default function parseFach(node: HTMLElement): Fach {
  const header = node.children[0] as HTMLElement;
  const table = node.children[node.childElementCount - 1];

  const name = header.children[0].innerHTML.trim();
  const ectsRange = parseECTSRange(header.children[1].children[1].innerHTML);

  return {
    name: name,
    minLP: ectsRange[0],
    maxLP: ectsRange[1],
    wahlbereiche: parseWahlbereicheTable(table),
  };
}
 /**
  * Parses strings containing ects ranges in the format /[0-9]+-[0-9]+/ and /[0-9+]/
  * @returns [minECTS, maxECTS]
  */
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
