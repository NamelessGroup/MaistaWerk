import Fach from "../../../model/Fach"
import { MetaData } from "../../../model/MetaData.ts";
import Modul from "../../../model/Module"
import Teilleistung from "../../../model/Teilleistung"
import FachSlotNames from "../model/FachSlotNames.ts";

export default interface State {
  choices: ChosenState
  modulhandbuch: Modulhandbuch
}

// Should store the choices of the user
export interface ChosenState {
  ueqPunkte: number
  chosenFachToModule: Map<string, [string, number][]>
  chosenModuleToTeilleistungenListe:Map<string,[string, number][]>
  chosenFaecher:Map<FachSlotNames, Fach>
}

// Should store the data imported from the jsons
export interface Modulhandbuch {
  module: Map<string, Modul>
  teilleistungen: Map<string, Teilleistung>
  ergaenzungsfaecher: Fach[]
  vertiefungsfaecher: Fach[]
  wahlbereich: Fach
  metaData: MetaData
}