export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string | null
          daily_goal: number
          notification_enabled: boolean
          notification_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname?: string | null
          daily_goal?: number
          notification_enabled?: boolean
          notification_time?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nickname?: string | null
          daily_goal?: number
          notification_enabled?: boolean
          notification_time?: string
          updated_at?: string
        }
      }
      memorize_verses: {
        Row: {
          id: string
          user_id: string
          book: string
          chapter: number
          verse_start: number
          verse_end: number | null
          text: string
          reference: string
          status: string
          ease_factor: number
          interval_days: number
          next_review_at: string
          review_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book: string
          chapter: number
          verse_start: number
          verse_end?: number | null
          text: string
          reference: string
          status?: string
          ease_factor?: number
          interval_days?: number
          next_review_at?: string
          review_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book?: string
          chapter?: number
          verse_start?: number
          verse_end?: number | null
          text?: string
          reference?: string
          status?: string
          ease_factor?: number
          interval_days?: number
          next_review_at?: string
          review_count?: number
        }
      }
      review_logs: {
        Row: {
          id: string
          verse_id: string
          user_id: string
          quality: number
          mode: string
          practiced_at: string
        }
        Insert: {
          id?: string
          verse_id: string
          user_id: string
          quality: number
          mode: string
          practiced_at?: string
        }
        Update: {
          id?: string
          verse_id?: string
          user_id?: string
          quality?: number
          mode?: string
          practiced_at?: string
        }
      }
      user_streaks: {
        Row: {
          id: string
          current_streak: number
          longest_streak: number
          last_practiced_date: string | null
          updated_at: string
        }
        Insert: {
          id: string
          current_streak?: number
          longest_streak?: number
          last_practiced_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          current_streak?: number
          longest_streak?: number
          last_practiced_date?: string | null
          updated_at?: string
        }
      }
    }
  }
}
