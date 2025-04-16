import Modul from "../../../model/Module"
import germanyFlag from '../assets/germany.png'
import ukFlag from '../assets/united-kingdom.png'
import sunSVG from '../assets/sun-solid.svg'
import snowflakeSVG from '../assets/snowflake-solid.svg'

export function getDozentName(modul: Modul): string {
  const r = /((Prof|Dr|PD|TT-Prof|rer|nat|Dipl)\.?)+[ -](.* )([^ ]*)$/i.exec(modul.verantwortlicher)
  if (r) return r[r.length - 1]
  return modul.verantwortlicher
}

export enum Lang {
  EN, DE, UNKNOWN
}

export enum Semester {
  WiSe, SoSe, UNKNOWN
}

export function getLanguage(modul: Modul): Lang {
  if (modul.sprache.toLocaleLowerCase() == 'englisch' || modul.sprache.toLocaleLowerCase() == 'english') {
    return Lang.EN
  } else if (modul.sprache.toLocaleLowerCase() == 'deutsch' || modul.sprache.toLocaleLowerCase() == 'german') {
    return Lang.DE
  } else {
    return Lang.UNKNOWN
  }
}

export function getLangImage(lang: Lang) {
  switch (lang) {
    case Lang.EN:
      return ukFlag
    case Lang.DE:
      return germanyFlag
    default:
      return ''
  }
}

export function getSemester(modul: Modul): Semester {
  if (modul.turnus.toLocaleLowerCase().includes("winter")) {
    return Semester.WiSe
  } else if (modul.turnus.toLocaleLowerCase().includes("sommer")) {
    return Semester.SoSe
  } else {
    return Semester.UNKNOWN
  }
}

export function getSemesterImage(semester: Semester) {
  switch (semester) {
    case Semester.WiSe:
      return snowflakeSVG
    case Semester.SoSe:
      return sunSVG
    default:
      return ''
  }
}