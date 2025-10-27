import { ChosenState } from "./state";

export function getAllModules(choices: ChosenState): string[] {
  return [...choices.chosenFachToModule.values()].flat().map(i => i[0] as string)
}

export function getAllTeillesitungen(choices: ChosenState) {
  return [...choices.chosenModuleToTeilleistungenListe].flat().map(i => i[0] as string)
}