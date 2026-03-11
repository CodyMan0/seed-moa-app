export interface ReviewResult {
  easeFactor: number
  intervalDays: number
  nextReviewAt: Date
}

/**
 * Simplified SM-2 spaced repetition algorithm.
 * @param quality - Rating from 1-5 (1=complete fail, 3=hard, 5=easy)
 * @param currentEaseFactor - Current ease factor (default 2.5 for new cards)
 * @param currentInterval - Current interval in days
 * @param reviewCount - Number of successful reviews so far
 */
export function calculateNextReview(
  quality: number,
  currentEaseFactor: number,
  currentInterval: number,
  reviewCount: number
): ReviewResult {
  let easeFactor =
    currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < 1.3) easeFactor = 1.3

  let intervalDays: number
  if (quality < 3) {
    // Failed - reset
    intervalDays = 1
  } else if (reviewCount === 0) {
    intervalDays = 1
  } else if (reviewCount === 1) {
    intervalDays = 3
  } else {
    intervalDays = Math.round(currentInterval * easeFactor)
  }

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays)

  return { easeFactor, intervalDays, nextReviewAt }
}
