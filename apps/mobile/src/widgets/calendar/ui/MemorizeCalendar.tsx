import { Text } from '@/shared/components/ui/text'
import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

interface MemorizeCalendarProps {
  practicedDates: string[]
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

function MemorizeCalendar({ practicedDates, onDatePress }: MemorizeCalendarProps) {
  const today = new Date()
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())

  const practicedSet = React.useMemo(() => new Set(practicedDates), [practicedDates])

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth)

  const goToPrevMonth = () => {
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
    <View className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={goToPrevMonth} className="px-3 py-1">
          <Text className="text-base text-muted-foreground">{'< 이전'}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">
          {currentYear}년 {currentMonth + 1}월
        </Text>
        <TouchableOpacity onPress={goToNextMonth} className="px-3 py-1">
          <Text className="text-base text-muted-foreground">{'다음 >'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View className="mb-2 flex-row">
        {DAY_NAMES.map((name, index) => (
          <View key={index} className="flex-1 items-center">
            <Text
              className={`text-xs font-medium ${
                index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-muted-foreground'
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
              return <View key={dayIndex} className="flex-1 items-center py-1.5" />
            }

            const dateStr = formatDate(currentYear, currentMonth, day)
            const isToday = dateStr === todayStr
            const isPracticed = practicedSet.has(dateStr)

            return (
              <TouchableOpacity
                key={dayIndex}
                className="flex-1 items-center py-1.5"
                onPress={() => onDatePress?.(dateStr)}
                activeOpacity={0.7}
              >
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isToday ? 'border-2 border-primary' : ''
                  } ${isPracticed ? 'bg-green-500/20' : ''}`}
                >
                  <Text
                    className={`text-sm ${
                      isToday ? 'font-bold text-primary' : 'text-foreground'
                    }`}
                  >
                    {day}
                  </Text>
                </View>
                {isPracticed && (
                  <View className="mt-0.5 h-1 w-1 rounded-full bg-green-500" />
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
