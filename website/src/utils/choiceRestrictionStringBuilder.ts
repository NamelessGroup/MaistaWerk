interface RestrictionModel {
  minLP: number
  maxLP: number
  minBestandteile: number
  maxBestandteile: number
}

interface RestrictionInput {
  minLP?: number
  maxLP?: number
  minBestandteile?: number
  maxBestandteile?: number
}

export default function getRestrictionString(res: RestrictionInput): string {
  const model = inputToModel(res)
  const point = restrictionPoint({min: model.minLP, max: model.maxLP}) + 'LP'
  const bestandteile = restrictionPoint({min: model.minBestandteile, max: model.maxBestandteile}) + 'Bestandteile'
  if (point && bestandteile) {
    return point + ' und ' + bestandteile
  }
  return point || bestandteile
}

function inputToModel(i: RestrictionInput): RestrictionModel {
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
  return `${res.min} - ${res.max}`
}