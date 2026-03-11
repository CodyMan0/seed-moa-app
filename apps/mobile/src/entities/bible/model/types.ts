export interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
}

export interface BibleBook {
  name: string
  shortName: string
  chapters: number
  testament: 'old' | 'new'
}

export type BibleReference = {
  book: string
  chapter: number
  verseStart: number
  verseEnd?: number
}
