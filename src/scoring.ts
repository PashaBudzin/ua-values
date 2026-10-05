import { scaleOf } from './questions'
import type { Band, Question } from './questions'

/** questionId -> вага обраної відповіді */
export type Answers = Record<string, number>

export type Result = {
  /** нормована сума ваг, -1..1 */
  score: number
  /** відсоток «на бік axis.high», 0..100 */
  percent: number
  /** потужність: |W1| + |W2| + ... + |Wn| */
  intensity: number
  /** сума найбільших |ваг| по кожному запитанню — теоретичний максимум потужності */
  intensityMax: number
  /** потужність у відсотках від intensityMax, 0..100 (для шкали й діапазонів) */
  intensityPercent: number
  answered: number
  towardLow: number
  towardHigh: number
  neutral: number
}

const maxWeightOf = (question: Question) => {
  const max = Math.max(...scaleOf(question).map((answer) => Math.abs(answer.weight)))
  return max > 0 ? max : 1
}

export function scoreAxis(
  questions: Question[],
  answers: Answers,
): Result | null {
  let sum = 0
  let max = 0
  let strength = 0
  let answered = 0
  let towardLow = 0
  let towardHigh = 0
  let neutral = 0

  for (const question of questions) {
    const weight = answers[question.id]
    if (weight === undefined) continue

    answered += 1
    sum += weight
    strength += Math.abs(weight)
    max += maxWeightOf(question)

    if (weight < 0) towardLow += 1
    else if (weight > 0) towardHigh += 1
    else neutral += 1
  }

  if (answered === 0 || max === 0) return null

  const score = sum / max

  return {
    score,
    percent: Math.round(((score + 1) / 2) * 100),
    intensity: strength,
    intensityMax: max,
    intensityPercent: Math.round((strength / max) * 100),
    answered,
    towardLow,
    towardHigh,
    neutral,
  }
}

/** bands мають бути відсортовані за min за зростанням. */
export function findBand(bands: Band[], percent: number): Band {
  return bands.filter((band) => percent >= band.min).at(-1) ?? bands[0]
}
