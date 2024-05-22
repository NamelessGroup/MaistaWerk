import { defineStore } from "pinia";
import State from "./state";
import Fach from "../../../model/Fach";
import Modul from "../../../model/Module";
import Teilleistung from "../../../model/Teilleistung";

import moduleJson from '../data/module.json'
import teilleistungJson from "../data/teilleistungen.json";
import wahlbereichJson from "../data/wahlbereich.json"
import ergaenzugsfaecherJson from "../data/erganzungsfach.json"
import vertiefungsfaecherJson from "../data/vertiefung.json"
import FachSlotNames from "../model/FachSlotNames";

const state = defineStore('state', {
  state: (): State => ({
    choices: {ueqPunkte: 2},
    modulhandbuch: {
      vertiefungsfaecher: vertiefungsfaecherJson as unknown as Fach[],
      ergaenzungsfaecher: ergaenzugsfaecherJson as unknown as Fach[],
      wahlbereich: wahlbereichJson as unknown as Fach,
      module: arrayToMap<Modul>(moduleJson as unknown as Modul[], (v)=>v.id),
      teilleistungen: arrayToMap<Teilleistung>(teilleistungJson as unknown as Teilleistung[], (v)=>v.id)
    }
  }),
  getters: {
    getUeQLp(): number { return this.choices.ueqPunkte },
    // returns the ids of all chosen modules,
    getAllChosenModule(): string[] {return ['M-INFO-101217', 'M-INFO-101215'];throw "Not yet implemented"},
    // returns all chosen teilleistungen
    getChosenTeilleistungen(): string[] {throw "Not yet implemented"},
    // returns the chosen teilleistugen for the given module in the given wahlbereich
    getChosenTeilleistungenForModul: (state: State) => (modulId: string, wahlbereichIndex: number): string[] => {throw "Not yet implemented"},
    // returns all teilleistungen for the chosen module
    getFach: (state: State) => (fach: FachSlotNames): Fach|undefined => {return state.modulhandbuch.ergaenzungsfaecher[2]},
    // returns the ids of the modules chosen in the given fach and the given wahlbereich
    getChosen: (state: State) => (fach: FachSlotNames, wahlbereichIndex: number): string[] => {return ['M-PHYS-101664'];throw "Not yet implemented"},
    // returns the sum of all lp
    getTotalChosenLP(): number {return 0;throw "Not yet implemented"},


    // Should efficiently return the stuff from the generated jsons
    getModulById: (state: State) => (id: string): Modul => {
      const modul = state.modulhandbuch.module.get(id)
      if (modul) return modul
      throw "No Modul found with id: " + id
    },
    getTeilleistungById: (state: State) => (id: string): Teilleistung => {
      const teilleistung = state.modulhandbuch.teilleistungen.get(id)
      if (teilleistung) return teilleistung
      throw "No Teilleistung found with id: " + id
    },
    getAllVertiefungsfaecher(): Fach[] {return this.modulhandbuch.vertiefungsfaecher},
    getAllErgaenzungsfaecher(): Fach[] {return this.modulhandbuch.ergaenzungsfaecher},
    getWahlbereich(): Fach {return this.modulhandbuch.wahlbereich},

    // for saving and restoring
    getChoicesAsJsonString(): string {
      return JSON.stringify(this.choices)
    }
  },
  actions: {
    setUeQLP(punkte: number) { this.choices.ueqPunkte = punkte },
    // sets the fach by name for the given slot
    setFach(fachSlot: FachSlotNames, fach: Fach) {},
    addModul(fach: FachSlotNames, wahlbereichIndex: number, id: string) {},
    removeModul(fach: FachSlotNames, wahlbereichIndex: number, id: string) {},
    addTeilleistung(modulId: string, teillesitungsId: string) {},
    removeTeilleistung(modulId: string, teillesitungsId: string) {},

    // for saving and restoring
    loadChoicesFromJsonString(json: string) {
      this.choices = JSON.parse(json)
    }
  }
})

export default state

function arrayToMap<V>(vs: V[], toKeyFunction: ((v:V) => string)) : Map<string, V> {
  const map: Map<string, V> = new Map()
  for (const v of vs) {
    map.set(toKeyFunction(v), v)
  }
  return map
}