import { defineStore } from "pinia";
import State from "./state";
import Fach from "../../../model/Fach";
import Modul from "../../../model/Module";
import Teilleistung from "../../../model/Teilleistung";

const state = defineStore('state', {
  state: (): State => ({
    choices: {ueqPunkte: 2},
    modulhandbuch: {}
  }),
  getters: {
    getUeQLp(): number { return this.choices.ueqPunkte },
    // returns the ids of all chosen modules
    getAllChosenModule(): string[] {throw "Not yet implemented"},
    // returns all chosen teilleistungen
    getChosenTeilleistungen(): string[] {throw "Not yet implemented"},
    // returns all teilleistungen for the chosen module
    getChosenTeilleistungenForModule: (state: State) => (moduleId: string): string[] =>  {throw "Not yet implemented"},
    // returns the chosen fach for the slot. if no fach is selected it returns undefined
    getFach: (state: State) => (fach: FachSlotNames): Fach|undefined => {throw "Not yet implemented"},
    // returns the ids of the modules chosen in the given fach and the given wahlbereich
    getChosen: (state: State) => (fach: FachSlotNames, wahlbereichIndex: number): string[] => {throw "Not yet implemented"},

    // Should efficiently return the stuff from the generated jsons
    getModulById: (state: State) => (id: string): Modul => {throw "Not yet implemented"},
    getTeilleistungById: (state: State) => (id: string): Teilleistung => {throw "Not yet implemented"},
    getAllFaecherVertiefungsfaecher(): Fach[] {throw "Not yet implemented"},
    getAllErgaenzungsfaecher(): Fach[] {throw "Not yet implemented"},
    getWahlbereich(): Fach {throw "Not yet implemented"},

    // for saving and restoring
    getChoicesAsJsonString(): string {throw "Not yet implemented"}
  },
  actions: {
    setUeQLP(punkte: number) { this.choices.ueqPunkte = punkte },
    // sets the fach by name for the given slot
    setFach(fach: FachSlotNames, fach: Fach) {},
    addModul(fach: FachSlotNames, wahlbereichIndex: number, id: string) {},
    addTeilleistung(modulId: string, teillesitungsId: string) {},

    // for saving and restoring
    loadChoicesFromJsonString(json: string) {}
  }
})

export default state