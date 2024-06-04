import Fach from "../../../model/Fach";

export default function fachNameBuilder(fach: Fach): string {
  if (fach.name.includes(': ')) {
    return fach.name.split(': ')[1]
  }
  return fach.name
}