import { HTMLElement } from "happy-dom"

/**
 * Gets the information from a metadata row
 * @param rowHTML innerHTML of the row
 */
export function getMetadataRow(rowHTML: string): string {
  const r = /<div[^>]+>[^<]*<\/div>( |\r|\n)*(.*)<\/div>/.exec(rowHTML)
  if (!r) throw 'Could not parse row: ' + rowHTML
  return r[2]
}

/**
 * Gets the verantworlicher from the table of a module/teilleistung
 * @param table the table
 */
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

export function extractLP(lpString: string): number {
  const lpMatch = lpString.match(/(\d+)\s*(LP)?/);
  if (lpMatch) {
    return Number(lpMatch[1]);
  }
  throw new Error(`Could not extract LP from string: ${lpString}`);
}