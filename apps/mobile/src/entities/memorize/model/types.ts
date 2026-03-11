export type VerseStatus = 'learning' | 'mastered'

export type PracticeMode = 'read' | 'initial' | 'blank' | 'typing'

export interface MemorizeVerse {
  id: string
  userId: string
  book: string
  chapter: number
  verseStart: number
  verseEnd: number | null
  text: string
  reference: string
  status: VerseStatus
  easeFactor: number
  intervalDays: number
  nextReviewAt: string
  reviewCount: number
  createdAt: string
}

export interface ReviewLog {
  id: string
  verseId: string
  userId: string
  quality: number
  mode: PracticeMode
  practicedAt: string
}

export interface UserStreak {
  currentStreak: number
  longestStreak: number
  lastPracticedDate: string | null
}
