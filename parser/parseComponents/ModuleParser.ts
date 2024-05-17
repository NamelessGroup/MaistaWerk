import { HTMLElement, HTMLTableElement } from "happy-dom";
import DomParser from "../domParser";
import Module, { ModuleMetadata } from "../model/Module";
import { children } from "happy-dom/lib/PropertySymbol";
import parseWahlbereicheTable from "./WahlbereicheParser";

export default function parseModule(container: HTMLElement) {
  const children = new DomParser(container).getAllChildren()
  console.log(children.length)
  const result: Module[] = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.classList.contains('moduleheader')) {
      let r = /Modul: ([^[]+) +\[([A-Z-0-9]+)\]/.exec(child.children[0].innerHTML)
      if (!r) throw "Wrong formatted module header: " + child.children[0].innerHTML
      const name = r[1];
      const id = r[2];
      const verantwortlicher = getVerantwortlicher(children[i+1] as HTMLTableElement)
      const metadata = getMetadata(children[i+2])
      const wahlbereiche = parseWahlbereicheTable(children[i+3] as HTMLTableElement)
      result.push({
        name, id, verantwortlicher, wahlbereiche, ...metadata, link: ''
      })
    }
  }
  return result
}

function getVerantwortlicher(table: HTMLElement): string {
  for (let i = 0; i < table.childElementCount; i++) {
    if (table.children[i].tagName.toLowerCase() == 'tr') {
      return table.children[i].children[1].children[0].innerHTML.trim()
    } else if (table.children[i].tagName.toLowerCase() == 'tbody') {
      return getVerantwortlicher(table.children[i])
    }
  }
  throw "No verantwortlicher found: " + table.innerHTML
}

function getMetadata(container: HTMLElement): ModuleMetadata {
  return {
    lp: Number(getMetadataRow(container.children[0])),
    turnus: getMetadataRow(container.children[2]),
    dauer: Number(getMetadataRow(container.children[3]).split(' ')[0]),
    sprache: getMetadataRow(container.children[4])
  }
}

function getMetadataRow(rowHTML: string): string {
  const r = /<div[^>]+>[^<]*<\/div>( |\r|\n)*(.*)<\/div>/.exec(rowHTML)
  if (!r) throw 'Could not parse row: ' + rowHTML
  return r[2]
}