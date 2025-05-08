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
      campaigns: {
        Row: {
          active: boolean
          created_at: string
          custom_message: string | null
          id: string
          name: string
          phone: string | null
          redirect_type: string
          require_contact: boolean
          require_name: boolean
          roi: number | null
          total_leads: number
          total_sales: number
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          custom_message?: string | null
          id?: string
          name: string
          phone?: string | null
          redirect_type?: string
          require_contact?: boolean
          require_name?: boolean
          roi?: number | null
          total_leads?: number
          total_sales?: number
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          custom_message?: string | null
          id?: string
          name?: string
          phone?: string | null
          redirect_type?: string
          require_contact?: boolean
          require_name?: boolean
          roi?: number | null
          total_leads?: number
          total_sales?: number
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      forms: {
        Row: {
          created_at: string
          id: string
          questions: Json
          settings: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          questions: Json
          settings: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          questions?: Json
          settings?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          campaign: string | null
          created_at: string
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          phone: string
          status: string
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          campaign?: string | null
          created_at?: string
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          phone: string
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          campaign?: string | null
          created_at?: string
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image: string | null
          name: string
          price: number
          purchase_link: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image?: string | null
          name: string
          price: number
          purchase_link?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          name?: string
          price?: number
          purchase_link?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          about: string | null
          banner: string | null
          contact: Json | null
          created_at: string
          id: string
          logo: string | null
          name: string
          updated_at: string
        }
        Insert: {
          about?: string | null
          banner?: string | null
          contact?: Json | null
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          updated_at?: string
        }
        Update: {
          about?: string | null
          banner?: string | null
          contact?: Json | null
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_archive: boolean | null
          created_at: string | null
          currency: string | null
          date_format: string | null
          id: string
          language: string | null
          notifications: Json | null
          profile: Json | null
          read_receipts: boolean | null
          security: Json | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          webhook_enabled: boolean | null
          webhook_url: string | null
          whatsapp: Json | null
        }
        Insert: {
          auto_archive?: boolean | null
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          profile?: Json | null
          read_receipts?: boolean | null
          security?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          webhook_enabled?: boolean | null
          webhook_url?: string | null
          whatsapp?: Json | null
        }
        Update: {
          auto_archive?: boolean | null
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          profile?: Json | null
          read_receipts?: boolean | null
          security?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          webhook_enabled?: boolean | null
          webhook_url?: string | null
          whatsapp?: Json | null
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
