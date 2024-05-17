import { HTMLElement, HTMLTableElement } from "happy-dom";
import DomParser from "../domParser";
import Module, { ModuleMetadata } from "../../model/Module";
import parseWahlbereicheTable from "./WahlbereicheParser";
import { getMetadataRow, getVerantwortlicher } from "./ModulTeilleistungCommon";

/**
 * @param container Container containing all the divs that represent modules
 */
export default function parseModule(container: HTMLElement): Module[] {
  const children = new DomParser(container).getAllChildren();
  const result: Module[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.classList.contains("moduleheader")) {
      let r = /Modul: ([^[]+) +\[([A-Z-0-9]+)\]/.exec(
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
      const wahlbereiche = parseWahlbereicheTable(
        children[i + 3] as HTMLTableElement
      );
      result.push({
        name,
        id,
        verantwortlicher,
        wahlbereiche,
        ...metadata,
        link: "",
      });
    }
  }
  return result;
}

/**
 * @param container div containing the rows of metadata 
 */
function getMetadata(container: HTMLElement): ModuleMetadata {
  return {
    lp: Number(getMetadataRow(container.children[0])),
    turnus: getMetadataRow(container.children[2]),
    dauer: Number(getMetadataRow(container.children[3]).split(" ")[0]),
    sprache: getMetadataRow(container.children[4]),
  };
}
