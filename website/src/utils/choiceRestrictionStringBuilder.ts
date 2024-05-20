export interface RestrictionModel {
  minLP: number
  maxLP: number
  minBestandteile: number
  maxBestandteile: number
}

export interface RestrictionInput {
  minLP?: number
  maxLP?: number
  minBestandteile?: number
  maxBestandteile?: number
}

export default function getRestrictionString(res: RestrictionInput): string {
  const model = inputToModel(res)
  const point = restrictionPoint({min: model.minLP, max: model.maxLP})
  const bestandteile = restrictionPoint({min: model.minBestandteile, max: model.maxBestandteile})
  if (point && bestandteile) {
    return point + ' LP und ' + bestandteile + ' Bestandteile'
  }
  if (point) {
    return point + ' LP'
  }
  if (bestandteile) {
    return bestandteile + ' Bestandteile'
  }
  return ''
}

export function inputToModel(i: RestrictionInput): RestrictionModel {
  return {
    minLP: i.minLP ?? NaN,
    maxLP: i.maxLP ?? NaN,
    minBestandteile: i.minBestandteile ?? NaN,
    maxBestandteile: i.maxBestandteile ?? NaN
  }
}

function restrictionPoint(res: {min: number, max: number}) {
  if (isNaN(res.min) && isNaN(res.max)) {
    return undefined
  }
  if (isNaN(res.min)) {
    return `Höchstens ${res.max}`
  }
  if (isNaN(res.max)) {
    return `Mindestens ${res.min}`
  }
  if (res.min == res.max) {
    return `${res.min}`
  }
  return `${res.min} - ${res.max}`
}