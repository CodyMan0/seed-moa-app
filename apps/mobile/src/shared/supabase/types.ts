export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      memorize_verses: {
        Row: {
          book: string
          chapter: number
          created_at: string | null
          ease_factor: number | null
          id: string
          interval_days: number | null
          next_review_at: string | null
          reference: string
          review_count: number | null
          status: string | null
          text: string
          user_id: string
          verse_end: number | null
          verse_start: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          next_review_at?: string | null
          reference: string
          review_count?: number | null
          status?: string | null
          text: string
          user_id: string
          verse_end?: number | null
          verse_start: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          next_review_at?: string | null
          reference?: string
          review_count?: number | null
          status?: string | null
          text?: string
          user_id?: string
          verse_end?: number | null
          verse_start?: number
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          id: string
          user_id: string
          category: string
          content: string
          email: string | null
          created_at: string | null
          status: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          content: string
          email?: string | null
          created_at?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          content?: string
          email?: string | null
          created_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          daily_goal: number | null
          id: string
          nickname: string | null
          notification_enabled: boolean | null
          notification_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_goal?: number | null
          id: string
          nickname?: string | null
          notification_enabled?: boolean | null
          notification_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_goal?: number | null
          id?: string
          nickname?: string | null
          notification_enabled?: boolean | null
          notification_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      review_logs: {
        Row: {
          id: string
          mode: string | null
          practiced_at: string | null
          quality: number
          user_id: string
          verse_id: string
        }
        Insert: {
          id?: string
          mode?: string | null
          practiced_at?: string | null
          quality: number
          user_id: string
          verse_id: string
        }
        Update: {
          id?: string
          mode?: string | null
          practiced_at?: string | null
          quality?: number
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_logs_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "memorize_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          status: string
          step_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          step_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          step_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number | null
          id: string
          last_practiced_date: string | null
          longest_streak: number | null
          updated_at: string | null
        }
        Insert: {
          current_streak?: number | null
          id: string
          last_practiced_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
        }
        Update: {
          current_streak?: number | null
          id?: string
          last_practiced_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
