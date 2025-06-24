export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chatbot_conversations: {
        Row: {
          created_at: string
          id: string
          message: string
          message_type: string | null
          response: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_type?: string | null
          response: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_type?: string | null
          response?: string
          user_id?: string | null
        }
        Relationships: []
      }
      login: {
        Row: {
          auth_user_id: string | null
          email: string
          id: string
          login_date: string
          login_ip: unknown | null
          login_method: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          auth_user_id?: string | null
          email: string
          id?: string
          login_date?: string
          login_ip?: unknown | null
          login_method?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          auth_user_id?: string | null
          email?: string
          id?: string
          login_date?: string
          login_ip?: unknown | null
          login_method?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          estimated_weight: number | null
          id: string
          latitude: number | null
          longitude: number | null
          pickup_address: string | null
          special_instructions: string | null
          status: string | null
          updated_at: string
          user_id: string | null
          waste_upload_id: string | null
        }
        Insert: {
          created_at?: string
          estimated_weight?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pickup_address?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          waste_upload_id?: string | null
        }
        Update: {
          created_at?: string
          estimated_weight?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pickup_address?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          waste_upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_waste_upload_id_fkey"
            columns: ["waste_upload_id"]
            isOneToOne: false
            referencedRelation: "waste_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          address: string | null
          auth_user_id: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          profile_image_url: string | null
          updated_at: string
          username: string
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      register: {
        Row: {
          address: string | null
          auth_user_id: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          registration_date: string
          registration_ip: unknown | null
          user_agent: string | null
          username: string
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          registration_date?: string
          registration_ip?: unknown | null
          user_agent?: string | null
          username: string
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          registration_date?: string
          registration_ip?: unknown | null
          user_agent?: string | null
          username?: string
        }
        Relationships: []
      }
      waste_uploads: {
        Row: {
          classification: string | null
          gemini_analysis: Json | null
          id: string
          image_path: string
          image_url: string
          pickup_location_lat: number | null
          pickup_location_lng: number | null
          uploaded_at: string
          user_id: string | null
          waste_type: string | null
        }
        Insert: {
          classification?: string | null
          gemini_analysis?: Json | null
          id?: string
          image_path: string
          image_url: string
          pickup_location_lat?: number | null
          pickup_location_lng?: number | null
          uploaded_at?: string
          user_id?: string | null
          waste_type?: string | null
        }
        Update: {
          classification?: string | null
          gemini_analysis?: Json | null
          id?: string
          image_path?: string
          image_url?: string
          pickup_location_lat?: number | null
          pickup_location_lng?: number | null
          uploaded_at?: string
          user_id?: string | null
          waste_type?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
