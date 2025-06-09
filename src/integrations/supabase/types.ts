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
      appointments: {
        Row: {
          client_id: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          service: string | null
          status: string | null
          time: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          service?: string | null
          status?: string | null
          time: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          service?: string | null
          status?: string | null
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          nome: string
          notes: string | null
          phone: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      expense_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          expense_type_id: string | null
          id: string
          notes: string | null
          purchase_date: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          expense_type_id?: string | null
          id?: string
          notes?: string | null
          purchase_date: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          expense_type_id?: string | null
          id?: string
          notes?: string | null
          purchase_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_expense_type_id_fkey"
            columns: ["expense_type_id"]
            isOneToOne: false
            referencedRelation: "expense_types"
            referencedColumns: ["id"]
          },
        ]
      }
      history: {
        Row: {
          appointment_id: string | null
          client_id: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          service: string | null
          time: string
        }
        Insert: {
          appointment_id?: string | null
          client_id: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          service?: string | null
          time: string
        }
        Update: {
          appointment_id?: string | null
          client_id?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          service?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          cost_price: number
          created_at: string | null
          description: string | null
          id: string
          name: string
          sell_price: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          cost_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          sell_price?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          cost_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          sell_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      revenues: {
        Row: {
          amount: number
          client_name: string
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string
          sale_id: string | null
          source_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          sale_id?: string | null
          source_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          sale_id?: string | null
          source_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          sale_id: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          sale_id?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          sale_id?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          sale_date: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          sale_date?: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          sale_date?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      servicos: {
        Row: {
          cor: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
          user_email: string
        }
        Insert: {
          cor?: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          user_email: string
        }
        Update: {
          cor?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_email?: string
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
