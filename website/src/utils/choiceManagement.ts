import { inputToModel, RestrictionInput } from "./choiceRestrictionStringBuilder";


export function canAcceptChoice(choiceLP: number, currentLP: number[], choice: RestrictionInput, remainingLP: number, hasToBeExactLP: boolean = false) {
  const restrictions = inputToModel(choice)
  const lpSum = currentLP.reduce((a, b) => a + b, 0)
  if (currentLP.length >= restrictions.maxBestandteile) return false
  if (lpSum >= restrictions.maxLP || remainingLP <= 0) return false
  if (hasToBeExactLP && (lpSum + choiceLP > restrictions.maxLP || lpSum + choiceLP > remainingLP)) return false
  return true
}

export function areRestrictionFulfilled(currentLP: number[], choice: RestrictionInput) {
  const restrictions = inputToModel(choice)
  if (isNaN(restrictions.minLP) && isNaN(restrictions.minBestandteile)) return true
  const lpSum = currentLP.reduce((a, b) => a + b, 0)
  
  if (!isNaN(restrictions.minBestandteile) && currentLP.length < restrictions.minBestandteile) return false
  if (!isNaN(restrictions.minLP) && lpSum < restrictions.minLP) return false
  return true
}