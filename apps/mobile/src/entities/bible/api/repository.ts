import type { BibleVerse, BibleReference } from '../model/types'

let bibleData: BibleVerse[] | null = null

export async function loadBibleData(): Promise<void> {
  if (bibleData) return
  const data = require('../../../../assets/data/bible-krv.json')
  bibleData = data as BibleVerse[]
}

export function getVerses(book: string, chapter: number): BibleVerse[] {
  if (!bibleData) return []
  return bibleData.filter(v => v.book === book && v.chapter === chapter)
}

export function getVerse(book: string, chapter: number, verse: number): BibleVerse | undefined {
  if (!bibleData) return undefined
  return bibleData.find(v => v.book === book && v.chapter === chapter && v.verse === verse)
}

export function getVerseRange(ref: BibleReference): BibleVerse[] {
  if (!bibleData) return []
  return bibleData.filter(v =>
    v.book === ref.book &&
    v.chapter === ref.chapter &&
    v.verse >= ref.verseStart &&
    v.verse <= (ref.verseEnd ?? ref.verseStart)
  )
}

export function getVerseText(ref: BibleReference): string {
  const verses = getVerseRange(ref)
  return verses.map(v => v.text).join(' ')
}
