import {defineStore} from "pinia";
import State, { ChosenState } from "./state";
import Fach, { SavedFach } from "../../../model/Fach";
import Modul from "../../../model/Module";
import Teilleistung from "../../../model/Teilleistung";

import moduleJson from '../data/module.json'
import teilleistungJson from "../data/teilleistungen.json";
import wahlbereichJson from "../data/wahlbereich.json"
import metadataJson from "../data/metadata.json"
import ergaenzugsfaecherJson from "../data/erganzungsfach.json"
import vertiefungsfaecherJson from "../data/vertiefung.json"
import FachSlotNames from "../model/FachSlotNames";
import isPflichtbereich from "../utils/PflichtbereichChecker.ts";
import { verifyLoadedChoices } from "./loadVerifier.ts";
import { router } from "../router/index.ts";
import { getAllModules, getAllTeillesitungen } from "./stateUtil.ts";

const state = defineStore('state', {
    state: (): State => {
        const faecher = new Map<FachSlotNames, SavedFach>()
        faecher.set(FachSlotNames.WAHL, { name: wahlbereichJson.name })
        const fachModulMap = new Map<string, [string, number][]>()
        fachModulMap.set(faecher.get(FachSlotNames.WAHL)?.name ?? '', [])
        return {
        choices: {
            ueqPunkte: 2,
            chosenFachToModule: fachModulMap,
            chosenModuleToTeilleistungenListe: new Map<string, [string, number][]>(),
            chosenFaecher: faecher,
            semesterToModulListe: new Map<number, string[]>(),
            semesterNames: new Map<number, string>()
        },
        modulhandbuch: {
            vertiefungsfaecher: vertiefungsfaecherJson as unknown as Fach[],
            ergaenzungsfaecher: ergaenzugsfaecherJson as unknown as Fach[],
            wahlbereich: wahlbereichJson as unknown as Fach,
            module: arrayToMap<Modul>(moduleJson as unknown as Modul[], (v) => v.id),
            teilleistungen: arrayToMap<Teilleistung>(teilleistungJson as unknown as Teilleistung[], (v) => v.id),
            metaData: metadataJson
        },
        errors: {
            errors: undefined,
            errorFullChoices: undefined
        }
    }},
    getters: {
        getUeQLp(): number {
            return this.choices.ueqPunkte
        },
        // returns the ids of all chosen modules
        getAllChosenModule(): string[] {
            return getAllModules(this.choices)
        },
        // returns all chosen teilleistungen
        getChosenTeilleistungen(): string[] {
            return getAllTeillesitungen(this.choices)
        },
        // returns the chosen teilleistugen for the given module in the given wahlbereich
        getChosenTeilleistungenForModul: (state: State) => (modulId: string, wahlbereichIndex: number): string[] => {
            return state.choices.chosenModuleToTeilleistungenListe.get(modulId)?.filter(i => i[1] == wahlbereichIndex).map(i => i[0] as string) ?? []
        },
        // returns all teilleistungen for the chosen module
        getFach: (state: State) => (fach: FachSlotNames): Fach | undefined => {
            const chosenFachName = state.choices.chosenFaecher.get(fach)?.name
            if (!chosenFachName) return undefined
            return getFachFromName(chosenFachName)
        },
        // returns the ids of the modules chosen in the given fach and the given wahlbereich
        getChosenFromWahlbereichAndFach: (state: State) => (fach: FachSlotNames, wahlbereichIndex: number): string[] => {
            return state.choices.chosenFachToModule.get(state.choices.chosenFaecher.get(fach)?.name ?? "")?.filter(i => i[1] === wahlbereichIndex).map(i => i[0] as string) ?? []
        },
        // returns the sum of all lp
        getTotalChosenLP(): number {
            const chosenFaecher = [...this.choices.chosenFaecher.values()].map(f => getFachFromName(f.name)).filter((f): f is Fach => f !== undefined)
            return chosenFaecher.map(i => Math.min(i.maxLP, (this.choices.chosenFachToModule.get(i.name)?.map(i => this.getModulById(i[0]).lp).reduce((a,b) => a+b, 0) ?? Infinity))).reduce((a,b)=> a+b, 0) + this.choices.ueqPunkte + 30
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
            return JSON.stringify({
                ueqPunkte: this.choices.ueqPunkte,
                chosenFachToModule: mapToRecord(this.choices.chosenFachToModule, k => k),
                chosenFaecher: mapToRecord(this.choices.chosenFaecher, k => k.valueOf()),
                chosenModuleToTeilleistungenListe: mapToRecord(this.choices.chosenModuleToTeilleistungenListe, k => k),
                semesterToModulListe: mapToRecord(this.choices.semesterToModulListe, k => k.toString()),
                semesterNames: mapToRecord(this.choices.semesterNames, k => k.toString())
            })
        },

        getSemesterName: (state: State) => (semester: number): string => {
            return state.choices.semesterNames.get(semester) ?? `Semester ${semester}`
        },
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
            this.choices.chosenFaecher.set(fachSlot, {name:fach.name})
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
                    w.modulliste.forEach(m => this.addTeilleistung(id, m, i))
                }
            })
            return true
        },
        removeModul(fachSlot: FachSlotNames, id: string) {
            const fach = this.choices.chosenFaecher.get(fachSlot)
            if (!fach) throw "Select Fach first"
            const newContent = this.choices.chosenFachToModule.get(fach.name)?.filter(i => i[0] !== id) ?? []
            this.choices.chosenFachToModule.set(fach.name, newContent)

            const semesterKeys = this.choices.semesterToModulListe.keys()
            for (const semesterKey of semesterKeys) {
                const newContent = this.choices.semesterToModulListe.get(semesterKey)?.filter(i => i !== id) ?? []
                this.choices.semesterToModulListe.set(semesterKey, newContent)
            }
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
            const recordChoices = JSON.parse(json)
            const newChoices: ChosenState = {
                ueqPunkte: recordChoices.ueqPunkte,
                chosenFachToModule: recordToMap(recordChoices.chosenFachToModule, k => k),
                chosenFaecher: recordToMap(recordChoices.chosenFaecher, k => k as FachSlotNames),
                chosenModuleToTeilleistungenListe: recordToMap(recordChoices.chosenModuleToTeilleistungenListe, k => k),
                semesterToModulListe: recordChoices.semesterToModulListe !== undefined ? recordToMap(recordChoices.semesterToModulListe, k => Number(k)) : new Map<number, string[]>(),
                semesterNames: recordChoices.semesterNames !== undefined ? recordToMap(recordChoices.semesterNames, k => Number(k)) : new Map<number, string>()
            }

            this.errors.errors = verifyLoadedChoices(newChoices)
            if (this.errors.errors !== undefined && this.errors.errors.length > 0) {
                console.error("Errors found while loading choices:", this.errors)
                this.errors.errorFullChoices = newChoices
                router.push({name: 'Error'})
            } else {
                this.choices = newChoices
            }
        },

        setSemesterName(semester: number, name: string) {
            this.choices.semesterNames.set(semester, name)
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

function recordToMap<K,V>(record: Record<string,V>, stringToKey: ((k:string)=>K)): Map<K,V> {
    const map: Map<K,V> = new Map()
    for (const k in record) {
        map.set(stringToKey(k), record[k])
    }
    return map
}

function mapToRecord<K,V>(map: Map<K,V>, keyToString: ((k:K)=>string)): Record<string,V> {
    const record: Record<string,V> = {}
    for (const [k,v] of map) {
        record[keyToString(k)] = v
    }
    return record
}

function fachNameMatcher(shortenedName: string, fachName: string): boolean {
    const r = fachName.toLowerCase().includes(shortenedName.toLowerCase())
    console.log(`Matching ${shortenedName} with ${fachName}: ${r}`)
    return r
}

function getFachFromName (name: string): Fach | undefined {
    if(fachNameMatcher(name, state().modulhandbuch.wahlbereich.name)) {
        return state().modulhandbuch.wahlbereich
    }
    const vertiefung = state().modulhandbuch.vertiefungsfaecher.find(i => fachNameMatcher(name, i.name))
    if (vertiefung) return vertiefung
    const erg = state().modulhandbuch.ergaenzungsfaecher.find(i => fachNameMatcher(name, i.name))
    if (erg) return erg
}