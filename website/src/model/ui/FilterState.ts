export interface FilterState {
  searchString: string
  minEcts: number
  maxEcts: number
  stammmoduleOnly: boolean
  semester: Semester[]
  language: Language[] 
}

export type Semester = 'SoSe'|'WiSe'|'unknown'
export type Language = 'De'|'Eng'|'unknown' 