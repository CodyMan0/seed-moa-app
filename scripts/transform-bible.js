#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Abbreviation → full Korean book name
const ABBREV_MAP = {
  // Old Testament
  '창': '창세기',
  '출': '출애굽기',
  '레': '레위기',
  '민': '민수기',
  '신': '신명기',
  '수': '여호수아',
  '삿': '사사기',
  '룻': '룻기',
  '삼상': '사무엘상',
  '삼하': '사무엘하',
  '왕상': '열왕기상',
  '왕하': '열왕기하',
  '대상': '역대상',
  '대하': '역대하',
  '스': '에스라',
  '느': '느헤미야',
  '에': '에스더',
  '욥': '욥기',
  '시': '시편',
  '잠': '잠언',
  '전': '전도서',
  '아': '아가',
  '사': '이사야',
  '렘': '예레미야',
  '애': '예레미야애가',
  '겔': '에스겔',
  '단': '다니엘',
  '호': '호세아',
  '욜': '요엘',
  '암': '아모스',
  '옵': '오바댜',
  '욘': '요나',
  '미': '미가',
  '나': '나훔',
  '합': '하박국',
  '습': '스바냐',
  '학': '학개',
  '슥': '스가랴',
  '말': '말라기',
  // New Testament
  '마': '마태복음',
  '막': '마가복음',
  '눅': '누가복음',
  '요': '요한복음',
  '행': '사도행전',
  '롬': '로마서',
  '고전': '고린도전서',
  '고후': '고린도후서',
  '갈': '갈라디아서',
  '엡': '에베소서',
  '빌': '빌립보서',
  '골': '골로새서',
  '살전': '데살로니가전서',
  '살후': '데살로니가후서',
  '딤전': '디모데전서',
  '딤후': '디모데후서',
  '딛': '디도서',
  '몬': '빌레몬서',
  '히': '히브리서',
  '약': '야고보서',
  '벧전': '베드로전서',
  '벧후': '베드로후서',
  '요일': '요한일서',
  '요이': '요한이서',
  '요삼': '요한삼서',
  '유': '유다서',
  '계': '요한계시록',
}

// Canonical book order for sorting
const BOOK_ORDER = [
  '창세기', '출애굽기', '레위기', '민수기', '신명기',
  '여호수아', '사사기', '룻기', '사무엘상', '사무엘하',
  '열왕기상', '열왕기하', '역대상', '역대하',
  '에스라', '느헤미야', '에스더', '욥기', '시편',
  '잠언', '전도서', '아가', '이사야', '예레미야',
  '예레미야애가', '에스겔', '다니엘',
  '호세아', '요엘', '아모스', '오바댜', '요나',
  '미가', '나훔', '하박국', '스바냐', '학개', '스가랴', '말라기',
  '마태복음', '마가복음', '누가복음', '요한복음', '사도행전',
  '로마서', '고린도전서', '고린도후서', '갈라디아서', '에베소서',
  '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서',
  '디모데전서', '디모데후서', '디도서', '빌레몬서', '히브리서',
  '야고보서', '베드로전서', '베드로후서',
  '요한일서', '요한이서', '요한삼서', '유다서', '요한계시록',
]

const BOOK_ORDER_MAP = Object.fromEntries(BOOK_ORDER.map((b, i) => [b, i]))

// Sort abbreviation keys by length descending so multi-char abbrevs match first
const ABBREV_KEYS_BY_LENGTH = Object.keys(ABBREV_MAP).sort((a, b) => b.length - a.length)

function parseKey(key) {
  // key format: "abbrev" + chapter + ":" + verse
  // e.g. "창1:1", "고전3:16", "삼상1:1"
  let abbrev = null
  let rest = null

  for (const abbrevKey of ABBREV_KEYS_BY_LENGTH) {
    if (key.startsWith(abbrevKey)) {
      abbrev = abbrevKey
      rest = key.slice(abbrevKey.length) // e.g. "1:1"
      break
    }
  }

  if (!abbrev || !rest) {
    throw new Error(`Could not parse key: ${key}`)
  }

  const colonIdx = rest.indexOf(':')
  if (colonIdx === -1) {
    throw new Error(`No colon found in key: ${key}`)
  }

  const chapter = parseInt(rest.slice(0, colonIdx), 10)
  const verse = parseInt(rest.slice(colonIdx + 1), 10)

  if (isNaN(chapter) || isNaN(verse)) {
    throw new Error(`Invalid chapter/verse in key: ${key}`)
  }

  const book = ABBREV_MAP[abbrev]
  if (!book) {
    throw new Error(`Unknown abbreviation "${abbrev}" from key: ${key}`)
  }

  return { book, chapter, verse }
}

function main() {
  const rootDir = path.resolve(__dirname, '..')
  const inputPath = path.join(rootDir, 'bible.json')
  const outputPath = path.join(rootDir, 'apps', 'mobile', 'assets', 'data', 'bible-krv.json')

  console.log('Reading bible.json...')
  const raw = fs.readFileSync(inputPath, 'utf-8')
  const data = JSON.parse(raw)

  console.log(`Parsed ${Object.keys(data).length} raw entries`)

  const verses = []
  const errors = []

  for (const [key, text] of Object.entries(data)) {
    try {
      const { book, chapter, verse } = parseKey(key)
      verses.push({
        book,
        chapter,
        verse,
        text: String(text).trim(),
      })
    } catch (e) {
      errors.push({ key, error: e.message })
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} parse errors:`)
    errors.forEach(e => console.error(`  ${e.key}: ${e.error}`))
  }

  // Sort by canonical book order, then chapter, then verse
  verses.sort((a, b) => {
    const bookDiff = (BOOK_ORDER_MAP[a.book] ?? 999) - (BOOK_ORDER_MAP[b.book] ?? 999)
    if (bookDiff !== 0) return bookDiff
    if (a.chapter !== b.chapter) return a.chapter - b.chapter
    return a.verse - b.verse
  })

  console.log(`\nWriting ${verses.length} verses to ${outputPath}`)
  fs.writeFileSync(outputPath, JSON.stringify(verses, null, 2), 'utf-8')
  console.log('Done.')

  // Verification summary
  const bookSet = new Set(verses.map(v => v.book))
  console.log(`\n--- Verification ---`)
  console.log(`Total verses: ${verses.length}`)
  console.log(`Unique books: ${bookSet.size}`)
  console.log(`First verse: ${JSON.stringify(verses[0])}`)
  console.log(`Last verse:  ${JSON.stringify(verses[verses.length - 1])}`)

  // Sample from OT and NT
  const otSample = verses.find(v => v.book === '시편' && v.chapter === 23 && v.verse === 1)
  const ntSample = verses.find(v => v.book === '요한복음' && v.chapter === 3 && v.verse === 16)
  console.log(`OT sample (시편 23:1): ${JSON.stringify(otSample)}`)
  console.log(`NT sample (요한복음 3:16): ${JSON.stringify(ntSample)}`)

  // List any books from BOOK_ORDER not found in data
  const missingBooks = BOOK_ORDER.filter(b => !bookSet.has(b))
  if (missingBooks.length > 0) {
    console.log(`\nMissing books: ${missingBooks.join(', ')}`)
  } else {
    console.log(`\nAll 66 canonical books present.`)
  }
}

main()
