import Modul from "../../../model/Module";
import { ChosenState } from "./state";
import { getAllModules } from "./stateUtil";
import state from "./store";

type LoadTypes = 'Modul'|'Teilleistung'

interface _LoadError<T extends LoadTypes> {
  toString: string;
  missingId: string,
  type: T
}
type ModulLoadError = _LoadError<'Modul'>;
interface TeilleistungLoadError extends _LoadError<'Teilleistung'> {
  modulId: string
}
export type LoadError = ModulLoadError | TeilleistungLoadError;


function buildModuleNotFoundError(id: string): ModulLoadError {
  return {
    toString: `Modul ${id} nicht im Modulhandbuch gefunden.`,
    missingId: id,
    type: 'Modul'
  };
}

function buildTeilleistungNotFoundError(id: string, modul: Modul): TeilleistungLoadError {
  return {
    toString: `Teilleistung ${id} in Modul ${modul.id} - ${modul.name} nicht im Modulhandbuch gefunden.`,
    missingId: id,
    type: 'Teilleistung',
    modulId: modul.id
  }
}

export function verifyLoadedChoices(choices: ChosenState) {
  const allModules = getAllModules(choices);
  console.log(choices, allModules)
  const moduleErrors: LoadError[] = [] 
  const teilleistungErrors: LoadError[] = []
  for (const mId of allModules) {
    try {
      console.log(mId)
      const modul = state().getModulById(mId);
      console.log(modul)
      for (const bereich of modul.wahlbereiche) {
        const teilleistungen = bereich.modulliste
        for (const teilleistung of teilleistungen) {
          console.log(mId, teilleistung)
          try {
            state().getTeilleistungById(teilleistung)
          } catch (e) {
            teilleistungErrors.push(buildTeilleistungNotFoundError(teilleistung, modul))
          }
        }
      }
    } catch (e) {
      moduleErrors.push(buildModuleNotFoundError(mId));
    }
  }
  if (moduleErrors.length === 0 && teilleistungErrors.length === 0) {
    return undefined
  }
  return [...moduleErrors, ...teilleistungErrors]
}

export function removeErrors(choices: ChosenState, errors:LoadError[]): ChosenState {
  const modulErrors = errors.filter(e => e.type === 'Modul').map(e => e.missingId);

  const faecher = Array.from(choices.chosenFachToModule.keys());
  for (const fach of faecher) {
    const filteredModules = choices.chosenFachToModule.get(fach)?.filter(([moduleId, _]) => !modulErrors.includes(moduleId));
    choices.chosenFachToModule.set(fach, filteredModules || []);
  }
  const semester = Array.from(choices.semesterToModulListe.keys());
  for (const sem of semester) {
    const filteredModules = choices.semesterToModulListe.get(sem)?.filter((moduleId) => !modulErrors.includes(moduleId));
    choices.semesterToModulListe.set(sem, filteredModules || []);
  }
  for (const mError of modulErrors) {
    choices.chosenModuleToTeilleistungenListe.delete(mError);
  }
  return choices
}