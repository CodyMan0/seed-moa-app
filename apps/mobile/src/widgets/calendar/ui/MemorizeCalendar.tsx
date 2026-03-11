import { Text } from '@/shared/components/ui/text'
import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

interface MemorizeCalendarProps {
  practicedDates: string[]
  joinedAt?: string // ISO date string (e.g. '2025-10-15T...')
  onDatePress?: (date: string) => void
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function formatDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function MemorizeCalendar({ practicedDates, joinedAt, onDatePress }: MemorizeCalendarProps) {
  console.log('[Calendar] practicedDates:', practicedDates, 'joinedAt:', joinedAt)
  const today = new Date()
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())

  const practicedSet = React.useMemo(() => new Set(practicedDates), [practicedDates])

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  // 가입일 파싱
  const joinedDate = joinedAt ? new Date(joinedAt) : null
  const joinedStr = joinedDate
    ? formatDate(joinedDate.getFullYear(), joinedDate.getMonth(), joinedDate.getDate())
    : null
  const joinedYear = joinedDate?.getFullYear() ?? 0
  const joinedMonth = joinedDate?.getMonth() ?? 0

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth)

  const canGoPrev = joinedDate
    ? currentYear > joinedYear || (currentYear === joinedYear && currentMonth > joinedMonth)
    : true

  const goToPrevMonth = () => {
    if (!canGoPrev) return
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const isPastDate = (dateStr: string) => dateStr < todayStr
  const isAfterJoined = (dateStr: string) => !joinedStr || dateStr >= joinedStr

  const weeks: (number | null)[][] = React.useMemo(() => {
    const rows: (number | null)[][] = []
    let currentWeek: (number | null)[] = []

    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        rows.push(currentWeek)
        currentWeek = []
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      rows.push(currentWeek)
    }

    return rows
  }, [firstDay, daysInMonth])

  return (
    <View className="rounded-xl border border-border bg-card p-3">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={goToPrevMonth} disabled={!canGoPrev} className={`h-8 w-8 items-center justify-center rounded-full active:bg-secondary ${!canGoPrev ? 'opacity-30' : ''}`}>
          <Text className="text-lg text-muted-foreground">{'‹'}</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-foreground">
          {currentYear}년 {currentMonth + 1}월
        </Text>
        <TouchableOpacity onPress={goToNextMonth} className="h-8 w-8 items-center justify-center rounded-full active:bg-secondary">
          <Text className="text-lg text-muted-foreground">{'›'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View className="mb-1 flex-row">
        {DAY_NAMES.map((name, index) => (
          <View key={index} className="flex-1 items-center">
            <Text
              className={`text-xs font-medium ${
                index === 0 ? 'text-bloom' : index === 6 ? 'text-water' : 'text-muted-foreground'
              }`}
            >
              {name}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row">
          {week.map((day, dayIndex) => {
            if (day === null) {
              return <View key={dayIndex} className="flex-1 items-center py-1" />
            }

            const dateStr = formatDate(currentYear, currentMonth, day)
            const isToday = dateStr === todayStr
            const isPracticed = practicedSet.has(dateStr)
            const isPast = isPastDate(dateStr)

            const afterJoined = isAfterJoined(dateStr)

            let dotColor: string | undefined
            if (isPracticed) {
              dotColor = '#22c55e' // green-500
            } else if (isPast && afterJoined) {
              dotColor = '#f87171' // red-400
            }

            return (
              <TouchableOpacity
                key={dayIndex}
                className="flex-1 items-center py-1"
                onPress={() => onDatePress?.(dateStr)}
                activeOpacity={0.7}
              >
                <View
                  className={`h-7 w-7 items-center justify-center rounded-full ${
                    isToday ? 'border-2 border-seed' : ''
                  }`}
                  style={isPracticed ? { backgroundColor: 'rgba(34, 197, 94, 0.15)' } : undefined}
                >
                  <Text
                    className={`text-xs ${
                      isToday
                        ? 'font-bold text-seed'
                        : isPracticed
                          ? 'font-medium'
                          : 'text-foreground'
                    }`}
                    style={isPracticed && !isToday ? { color: '#15803d' } : undefined}
                  >
                    {day}
                  </Text>
                </View>
                {dotColor && (
                  <View
                    className="mt-0.5 rounded-full"
                    style={{ backgroundColor: dotColor, width: 6, height: 6 }}
                  />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      ))}
    </View>
  )
}

export { MemorizeCalendar }
export type { MemorizeCalendarProps }
