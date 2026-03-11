import * as Notifications from 'expo-notifications'

/**
 * Request notification permissions from the user.
 * Returns true if permissions were granted.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()

  if (existingStatus === 'granted') return true

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

/**
 * Schedule memorization reminders for a verse.
 * Schedules daily notifications at 9:00, 12:00, 15:00, 18:00
 * until 19:00 (7 PM).
 */
export async function scheduleVerseReminders(
  verseId: string,
  reference: string,
  verseText: string,
): Promise<void> {
  await cancelVerseReminders(verseId)

  const hours = [9, 12, 15, 18]

  for (const hour of hours) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `\uD83D\uDCD6 ${reference}`,
        body: verseText.length > 50 ? verseText.substring(0, 50) + '...' : verseText,
        data: { verseId, type: 'practice_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
      identifier: `verse-${verseId}-${hour}`,
    })
  }
}

/**
 * Cancel all reminders for a specific verse.
 */
export async function cancelVerseReminders(verseId: string): Promise<void> {
  const hours = [9, 12, 15, 18]
  for (const hour of hours) {
    await Notifications.cancelScheduledNotificationAsync(`verse-${verseId}-${hour}`)
  }
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

/**
 * Schedule a monthly summary notification for the last day of the current month at 9 PM
 */
export async function scheduleMonthlyReminder() {
  // Cancel existing monthly reminder
  const scheduled = await Notifications.getAllScheduledNotificationsAsync()
  for (const notif of scheduled) {
    if (notif.content.data?.type === 'monthly_summary') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier)
    }
  }

  // Get last day of current month
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // If we're past the last day of the month already, schedule for next month
  if (now.getDate() === lastDay.getDate() && now.getHours() >= 21) {
    lastDay.setMonth(lastDay.getMonth() + 1)
    lastDay.setDate(new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 0).getDate())
  }

  lastDay.setHours(21, 0, 0, 0) // 9 PM

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌱 이번 달 암송 리포트',
      body: '이번 달의 말씀 암송 여정을 확인해보세요!',
      data: { type: 'monthly_summary' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: lastDay,
    },
  })
}

/**
 * Set up the notification handler. Call on app startup.
 */
export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
}
