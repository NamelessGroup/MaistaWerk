import { HTMLElement } from "happy-dom"

export function getMetadataRow(rowHTML: string): string {
  const r = /<div[^>]+>[^<]*<\/div>( |\r|\n)*(.*)<\/div>/.exec(rowHTML)
  if (!r) throw 'Could not parse row: ' + rowHTML
  return r[2]
}

export function getVerantwortlicher(table: HTMLElement): string {
  for (let i = 0; i < table.childElementCount; i++) {
    if (table.children[i].tagName.toLowerCase() == 'tr') {
      return table.children[i].children[1].children[0].innerHTML.trim()
    } else if (table.children[i].tagName.toLowerCase() == 'tbody') {
      return getVerantwortlicher(table.children[i])
    }
  }
  throw "No verantwortlicher found: " + table.innerHTML
}