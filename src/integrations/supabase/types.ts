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
      architecture_docs: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number
          repository_id: string
          section_type: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number
          repository_id: string
          section_type: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number
          repository_id?: string
          section_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "architecture_docs_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_explanations: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          order_index: number
          question: string | null
          repository_id: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          order_index?: number
          question?: string | null
          repository_id: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          order_index?: number
          question?: string | null
          repository_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_explanations_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_proposals: {
        Row: {
          ai_generated_content: string | null
          created_at: string
          function_id: string
          function_name: string
          id: string
          proposal_type: string
          repository_id: string
          status: string
          updated_at: string
          user_content: string | null
        }
        Insert: {
          ai_generated_content?: string | null
          created_at?: string
          function_id: string
          function_name: string
          id?: string
          proposal_type: string
          repository_id: string
          status?: string
          updated_at?: string
          user_content?: string | null
        }
        Update: {
          ai_generated_content?: string | null
          created_at?: string
          function_id?: string
          function_name?: string
          id?: string
          proposal_type?: string
          repository_id?: string
          status?: string
          updated_at?: string
          user_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_proposals_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      function_analyses: {
        Row: {
          complexity_level: string | null
          created_at: string
          description: string
          file_path: string
          function_name: string
          function_signature: string | null
          id: string
          parameters: Json | null
          repository_id: string
          return_value: string | null
          tags: string[] | null
          usage_example: string | null
        }
        Insert: {
          complexity_level?: string | null
          created_at?: string
          description: string
          file_path: string
          function_name: string
          function_signature?: string | null
          id?: string
          parameters?: Json | null
          repository_id: string
          return_value?: string | null
          tags?: string[] | null
          usage_example?: string | null
        }
        Update: {
          complexity_level?: string | null
          created_at?: string
          description?: string
          file_path?: string
          function_name?: string
          function_signature?: string | null
          id?: string
          parameters?: Json | null
          repository_id?: string
          return_value?: string | null
          tags?: string[] | null
          usage_example?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "function_analyses_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      function_qa: {
        Row: {
          answer: string | null
          created_at: string
          function_id: string
          function_name: string
          id: string
          question: string
          question_type: string
          repository_id: string
          updated_at: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          function_id: string
          function_name: string
          id?: string
          question: string
          question_type: string
          repository_id: string
          updated_at?: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          function_id?: string
          function_name?: string
          id?: string
          question?: string
          question_type?: string
          repository_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "function_qa_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      repositories: {
        Row: {
          analyzed_at: string | null
          created_at: string
          description: string | null
          forks: number | null
          github_url: string
          id: string
          language: string | null
          name: string
          owner: string
          stars: number | null
          status: string
          updated_at: string
        }
        Insert: {
          analyzed_at?: string | null
          created_at?: string
          description?: string | null
          forks?: number | null
          github_url: string
          id?: string
          language?: string | null
          name: string
          owner: string
          stars?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          analyzed_at?: string | null
          created_at?: string
          description?: string | null
          forks?: number | null
          github_url?: string
          id?: string
          language?: string | null
          name?: string
          owner?: string
          stars?: number | null
          status?: string
          updated_at?: string
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
