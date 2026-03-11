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
