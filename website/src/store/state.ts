import Fach from "../../../model/Fach"
import Modul from "../../../model/Module"
import Teilleistung from "../../../model/Teilleistung"

export default interface State {
  choices: ChosenState
  modulhandbuch: Modulhandbuch
}

// Should store the choices of the user
export interface ChosenState {
  ueqPunkte: number
}

// Should store the data imported from the jsons
export interface Modulhandbuch {
  module: Map<string, Modul>
  teilleistungen: Map<string, Teilleistung>
  ergaenzungsfaecher: Fach[]
  vertiefungsfaecher: Fach[]
  wahlbereich: Fach
}