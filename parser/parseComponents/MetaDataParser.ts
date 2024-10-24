import { MetaData } from "../../model/MetaData";
import { HTMLElement } from "happy-dom";

export default function parseMetaData(node: HTMLElement): MetaData {
  const parts = node.innerHTML.split(/<br[ /]{0,2}>/).map(i => i.trim())
  return {
    spo: parts[0],
    semester: parts[1],
    stand: parts[2]
  }
}