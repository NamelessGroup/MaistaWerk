export enum SortingOptions {
  NAME = "Alphabetisch",
  DOZENT = "Dozent",
  ECTS = "ECTS",
  SEMSTER = "Semester",
  SPRACHE = "Sprache",
}

export interface SortingState {
  sortBy: SortingOptions
  direction: 1|-1
}