import type { BibleReference } from '../model/types'

export function formatReference(ref: BibleReference): string {
  const verseRange = ref.verseEnd != null
    ? `${ref.verseStart}-${ref.verseEnd}`
    : `${ref.verseStart}`
  return `${ref.book} ${ref.chapter}:${verseRange}`
}

const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]

export function getInitialConsonant(char: string): string {
  const code = char.charCodeAt(0)
  if (code < 0xAC00 || code > 0xD7A3) return char
  const index = Math.floor((code - 0xAC00) / 588)
  return INITIAL_CONSONANTS[index]
}

export function getInitialHint(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0)
      if (code >= 0xAC00 && code <= 0xD7A3) {
        return getInitialConsonant(char)
      }
      return char
    })
    .join('')
}
