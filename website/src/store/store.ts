import {defineStore} from "pinia";
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
import isPflichtbereich from "../utils/PflichtbereichChecker.ts";

const state = defineStore('state', {
    state: (): State => {
        const faecher = new Map<FachSlotNames, Fach>()
        faecher.set(FachSlotNames.WAHL, wahlbereichJson as unknown as Fach)
        const fachModulMap = new Map<string, [string, number][]>()
        fachModulMap.set(faecher.get(FachSlotNames.WAHL)?.name ?? '', [])
        return {
        choices: {
            ueqPunkte: 2,
            chosenFachToModule: fachModulMap,
            chosenModuleToTeilleistungenListe: new Map<string, [string, number][]>(),
            chosenFaecher: faecher

        },
        modulhandbuch: {
            vertiefungsfaecher: vertiefungsfaecherJson as unknown as Fach[],
            ergaenzungsfaecher: ergaenzugsfaecherJson as unknown as Fach[],
            wahlbereich: wahlbereichJson as unknown as Fach,
            module: arrayToMap<Modul>(moduleJson as unknown as Modul[], (v) => v.id),
            teilleistungen: arrayToMap<Teilleistung>(teilleistungJson as unknown as Teilleistung[], (v) => v.id)
        }
    }},
    getters: {
        getUeQLp(): number {
            return this.choices.ueqPunkte
        },
        // returns the ids of all chosen modules
        getAllChosenModule(): string[] {
            return [...this.choices.chosenFachToModule.values()].flat().map(i => i[0] as string)
        },
        // returns all chosen teilleistungen
        getChosenTeilleistungen(): string[] {
            return [...this.choices.chosenModuleToTeilleistungenListe].flat().map(i => i[0] as string)
        },
        // returns the chosen teilleistugen for the given module in the given wahlbereich
        getChosenTeilleistungenForModul: (state: State) => (modulId: string, wahlbereichIndex: number): string[] => {
            return state.choices.chosenModuleToTeilleistungenListe.get(modulId)?.filter(i => i[1] == wahlbereichIndex).map(i => i[0] as string) ?? []
        },
        // returns all teilleistungen for the chosen module
        getFach: (state: State) => (fach: FachSlotNames): Fach | undefined => {
            return state.choices.chosenFaecher.get(fach)
        },
        // returns the ids of the modules chosen in the given fach and the given wahlbereich
        getChosenFromWahlbereichAndFach: (state: State) => (fach: FachSlotNames, wahlbereichIndex: number): string[] => {
            return state.choices.chosenFachToModule.get(state.choices.chosenFaecher.get(fach)?.name ?? "")?.filter(i => i[1] === wahlbereichIndex).map(i => i[0] as string) ?? []
        },
        // returns the sum of all lp
        getTotalChosenLP(): number {
            return this.choices.ueqPunkte + [...this.choices.chosenFachToModule.values()].flat().map(i => this.getModulById(i[0]).lp).reduce((a,b) => a+b,0)
        },
        getMaximumLP(): number {
            return 120
        },


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
        getAllVertiefungsfaecher(): Fach[] {
            return this.modulhandbuch.vertiefungsfaecher
        },
        getAllErgaenzungsfaecher(): Fach[] {
            return this.modulhandbuch.ergaenzungsfaecher
        },
        getWahlbereich(): Fach {
            return this.modulhandbuch.wahlbereich
        },

        // for saving and restoring
        getChoicesAsJsonString(): string {
            return JSON.stringify(this.choices)
        }
    },
    actions: {
        setUeQLP(punkte: number) {
            this.choices.ueqPunkte = punkte
        },
        // sets the fach by name for the given slot
        setFach(fachSlot: FachSlotNames, fach: Fach) {
            const currentFach = this.choices.chosenFaecher.get(fachSlot)
            if (currentFach) {
                const module = (this.choices.chosenFachToModule.get(currentFach.name) ?? []).map(i => i[0] as string)
                this.choices.chosenFachToModule.delete(currentFach.name)
                module.forEach(i => this.choices.chosenModuleToTeilleistungenListe.delete(i))
            }
            this.choices.chosenFaecher.set(fachSlot, fach)
            this.choices.chosenFachToModule.set(fach.name, [])
            fach.wahlbereiche.forEach((w,i) => {
                if (isPflichtbereich(w, this.getModulById)) {
                    w.modulliste.forEach(m => this.addModul(fachSlot, m, i))
                }
            })
        },
        addModul(fachSlot: FachSlotNames, id: string, wahlbereichIndex: number): boolean {
            const fach = this.choices.chosenFaecher.get(fachSlot)
            if (!fach) {
                return false
            }
            this.choices.chosenFachToModule.get(fach.name)?.push([id, wahlbereichIndex])
            this.choices.chosenModuleToTeilleistungenListe.set(id, [])
            this.getModulById(id).wahlbereiche.forEach((w,i) => {
                if (isPflichtbereich(w, this.getTeilleistungById)) {
                    w.modulliste.forEach(m => this.addTeilleistung(fachSlot, m, i))
                }
            })
            return true
        },
        removeModul(fachSlot: FachSlotNames, id: string) {
            const fach = this.choices.chosenFaecher.get(fachSlot)
            if (!fach) throw "Select Fach first"
            const newContent = this.choices.chosenFachToModule.get(fach.name)?.filter(i => i[0] !== id) ?? []
            this.choices.chosenFachToModule.set(fach.name, newContent)
        },
        addTeilleistung(modulId: string, teillesitungsId: string, wahlbereichsIndex: number) {
            this.choices.chosenModuleToTeilleistungenListe.get(modulId)?.push([teillesitungsId, wahlbereichsIndex])
        },
        removeTeilleistung(modulId: string, teillesitungsId: string) {
            const newContent = this.choices.chosenModuleToTeilleistungenListe.get(modulId)?.filter(i => i[0] !== teillesitungsId) ?? []
            this.choices.chosenModuleToTeilleistungenListe.set(modulId, newContent)
        },

        // for saving and restoring
        loadChoicesFromJsonString(json: string) {
            this.choices = JSON.parse(json)
        }
    }
})

export default state

function arrayToMap<V>(vs: V[], toKeyFunction: ((v: V) => string)): Map<string, V> {
    const map: Map<string, V> = new Map()
    for (const v of vs) {
        map.set(toKeyFunction(v), v)
    }
    return map
}