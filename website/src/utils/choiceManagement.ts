import { inputToModel, RestrictionInput } from "./choiceRestrictionStringBuilder";


export function canAcceptChoice(choiceLP: number, currentLP: number[], choice: RestrictionInput, remainingLP: number, hasToBeExactLP: boolean = false) {
  const restrictions = inputToModel(choice)
  const lpSum = currentLP.reduce((a, b) => a + b, 0)
  if (currentLP.length >= currentLP.length) return false
  if (lpSum >= restrictions.maxLP || lpSum >= remainingLP) return false
  if (hasToBeExactLP && (lpSum + choiceLP > restrictions.maxLP || lpSum + choiceLP > remainingLP)) return false
  return true
}

export function areRestrictionFulfilled(currentLP: number[], choice: RestrictionInput) {
  const restrictions = inputToModel(choice)
  const lpSum = currentLP.reduce((a, b) => a + b, 0)
  if (currentLP.length < restrictions.minBestandteile) return false
  if (currentLP.length > restrictions.maxBestandteile) return false
  if (lpSum < restrictions.minLP) return false
  return false
}