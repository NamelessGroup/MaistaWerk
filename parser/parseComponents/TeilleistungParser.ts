import { HTMLElement, HTMLTableElement } from "happy-dom";
import DomParser from "../domParser";
import { extractLP, getMetadataRow, getVerantwortlicher } from "./ModulTeilleistungCommon";
import Teilleistung, { TeilleistungMetadata } from "../../model/Teilleistung";

/**
 * @param container Container containing all the divs that represent teilleistungen
 */
export default function parseTeilleistungen(
  container: HTMLElement
): Teilleistung[] {
  const children = new DomParser(container).getAllChildren();
  const result: Teilleistung[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.classList.contains("brickheader")) {
      let r = /Teilleistung: ([^[]+) +\[([A-Z-0-9]+) *\]/.exec(
        child.children[0].innerHTML
      );
      if (!r)
        throw "Wrong formatted module header: " + child.children[0].innerHTML;
      const name = r[1];
      const id = r[2];
      const verantwortlicher = getVerantwortlicher(
        children[i + 1] as HTMLTableElement
      );
      const metadata = getMetadata(children[i + 2]);
      result.push({
        name,
        id,
        verantwortlicher,
        ...metadata,
      });
    }
  }
  return result;
}

/**
 * @param container div containing the rows of metadata 
 */
function getMetadata(container: HTMLElement): TeilleistungMetadata {
  return {
    teilleistungsart: getMetadataRow(container.children[0]),
    lp: extractLP(getMetadataRow(container.children[1])),
    turnus: getMetadataRow(container.children[3]),
  };
}
