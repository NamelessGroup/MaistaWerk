import Modul from "../../../model/Module";

export interface CustomModul extends Partial<Modul> {
  name: string
  lp: number
  turnus: string
  sprache: string
}

export const customId = 'custom'
export const seperator = '___'

export function modulToString(modul: CustomModul): string {
  return customId + seperator + modul.name + seperator + modul.lp + seperator + modul.turnus + seperator + modul.sprache
}

export function stringToModul(modulString: string): CustomModul {
  const modul = modulString.split(seperator)
  return {
    name: modul[1],
    lp: parseInt(modul[2]),
    turnus: modul[3],
    sprache: modul[4]
  }
}

export function extendToModul(custom: CustomModul): Modul {
  return {
    id: customId,
    name: custom.name,
    lp: custom.lp,
    turnus: custom.turnus,
    sprache: custom.sprache,
    verantwortlicher: "",
    link: "",
    wahlbereiche: [],
    dauer: 0,
  }
}

export const customMasterArbeit: CustomModul = {
  name: "Masterarbeit",
  lp: 30,
  turnus: "Jedes Semester",
  sprache: "unbekannt"
}