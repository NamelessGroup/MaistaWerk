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
  const moduleErrors: LoadError[] = [] 
  const teilleistungErrors: LoadError[] = []
  for (const mId of allModules) {
    try {
      const modul = state().getModulById(mId);
      const chosenTeilleistungen = choices.chosenModuleToTeilleistungenListe.get(mId) || [];
      for (const teilleistung of chosenTeilleistungen) {
        try {
          state().getTeilleistungById(teilleistung[0]);
        } catch (e) {
          teilleistungErrors.push(buildTeilleistungNotFoundError(teilleistung[0], modul));
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

  const teilleistungErrors = errors.filter(e => e.type === 'Teilleistung') as TeilleistungLoadError[];
  for (const tError of teilleistungErrors) {
    const teilleistungen = choices.chosenModuleToTeilleistungenListe.get(tError.modulId) || [];
    const filteredTeilleistungen = teilleistungen.filter(([tId, _]) => tId !== tError.missingId);
    choices.chosenModuleToTeilleistungenListe.set(tError.modulId, filteredTeilleistungen);
  }
  return choices
}