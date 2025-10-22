import Modul from "../../../model/Module";
import state from "./store";

type LoadTypes = 'Modul'|'Teilleistung'

export interface LoadError {
  toString: string;
  missingId: string,
  type: LoadTypes
}

function buildModuleNotFoundError(id: string): LoadError {
  return {
    toString: `Modul ${id} nicht im Modulhandbuch gefunden.`,
    missingId: id,
    type: 'Modul'
  };
}

function buildTeilleistungNotFoundError(id: string, modul: Modul): LoadError {
  return {
    toString: `Teilleistung ${id} in Modul ${modul.id} - ${modul.name} nicht im Modulhandbuch gefunden.`,
    missingId: id,
    type: 'Teilleistung'
  }
}

export function verifyLoadedChoices() {
  const allModules = state().getAllChosenModule;
  const moduleErrors: LoadError[] = [] 
  const teilleistungErrors: LoadError[] = []
  for (const mId of allModules) {
    try {
      const modul = state().getModulById(mId);
      for (const bereich of modul.wahlbereiche) {
        const teilleistungen = bereich.modulliste
        for (const teilleistung of teilleistungen) {
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
  return [...moduleErrors, ...teilleistungErrors]
}

