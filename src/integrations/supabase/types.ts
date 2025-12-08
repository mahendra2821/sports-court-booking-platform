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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      booking_equipment: {
        Row: {
          booking_id: string
          created_at: string
          equipment_id: string
          id: string
          price_at_booking: number
          quantity: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          equipment_id: string
          id?: string
          price_at_booking?: number
          quantity?: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          equipment_id?: string
          id?: string
          price_at_booking?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_equipment_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          adjustments_price: number
          base_price: number
          booking_date: string
          coach_id: string | null
          coach_price: number
          court_id: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          end_time: string
          equipment_price: number
          id: string
          notes: string | null
          price_breakdown: Json | null
          start_time: string
          status: string
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          adjustments_price?: number
          base_price?: number
          booking_date: string
          coach_id?: string | null
          coach_price?: number
          court_id: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time: string
          equipment_price?: number
          id?: string
          notes?: string | null
          price_breakdown?: Json | null
          start_time: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          adjustments_price?: number
          base_price?: number
          booking_date?: string
          coach_id?: string | null
          coach_price?: number
          court_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string
          equipment_price?: number
          id?: string
          notes?: string | null
          price_breakdown?: Json | null
          start_time?: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_availability: {
        Row: {
          coach_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_availability_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          hourly_rate: number
          id: string
          is_active: boolean
          name: string
          specialization: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number
          id?: string
          is_active?: boolean
          name: string
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number
          id?: string
          is_active?: boolean
          name?: string
          specialization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      court_base_prices: {
        Row: {
          base_hourly_rate: number
          court_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          base_hourly_rate?: number
          court_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          base_hourly_rate?: number
          court_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_base_prices_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: true
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          court_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          court_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          court_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          available_quantity: number
          created_at: string
          equipment_type: string
          id: string
          is_active: boolean
          name: string
          rental_price: number
          total_quantity: number
          updated_at: string
        }
        Insert: {
          available_quantity?: number
          created_at?: string
          equipment_type: string
          id?: string
          is_active?: boolean
          name: string
          rental_price?: number
          total_quantity?: number
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          created_at?: string
          equipment_type?: string
          id?: string
          is_active?: boolean
          name?: string
          rental_price?: number
          total_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          conditions: Json
          created_at: string
          description: string | null
          flat_fee: number
          id: string
          is_active: boolean
          multiplier: number
          name: string
          priority: number
          rule_type: string
          updated_at: string
        }
        Insert: {
          conditions?: Json
          created_at?: string
          description?: string | null
          flat_fee?: number
          id?: string
          is_active?: boolean
          multiplier?: number
          name: string
          priority?: number
          rule_type: string
          updated_at?: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          description?: string | null
          flat_fee?: number
          id?: string
          is_active?: boolean
          multiplier?: number
          name?: string
          priority?: number
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          booking_date: string
          court_id: string
          created_at: string
          customer_email: string
          customer_name: string | null
          end_time: string
          id: string
          notified: boolean
          position: number
          start_time: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          court_id: string
          created_at?: string
          customer_email: string
          customer_name?: string | null
          end_time: string
          id?: string
          notified?: boolean
          position?: number
          start_time: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          court_id?: string
          created_at?: string
          customer_email?: string
          customer_name?: string | null
          end_time?: string
          id?: string
          notified?: boolean
          position?: number
          start_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
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
