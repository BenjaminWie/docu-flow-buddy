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
      chat_conversations: {
        Row: {
          conversation_type: string
          created_at: string
          function_id: string | null
          id: string
          repository_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          conversation_type?: string
          created_at?: string
          function_id?: string | null
          id?: string
          repository_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          conversation_type?: string
          created_at?: string
          function_id?: string | null
          id?: string
          repository_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      code_complexity_analysis: {
        Row: {
          business_description: string | null
          cognitive_complexity: number | null
          cognitive_load: number | null
          combined_complexity_score: number | null
          created_at: string | null
          cyclomatic_complexity: number | null
          developer_description: string | null
          documentation_quality: number | null
          documentation_score: number | null
          end_line: number | null
          explanation: string | null
          file_url: string | null
          function_length: number | null
          function_name: string
          github_url: string | null
          id: number
          language: string | null
          llm_score: number | null
          maintainability: number | null
          nesting_depth: number | null
          parameter_count: number | null
          refactoring_urgency: number | null
          related_functions_analyzed: number | null
          semantic_complexity: number | null
          start_line: number | null
          suggestions: Json | null
          total_complexity_score: number | null
          updated_at: string | null
        }
        Insert: {
          business_description?: string | null
          cognitive_complexity?: number | null
          cognitive_load?: number | null
          combined_complexity_score?: number | null
          created_at?: string | null
          cyclomatic_complexity?: number | null
          developer_description?: string | null
          documentation_quality?: number | null
          documentation_score?: number | null
          end_line?: number | null
          explanation?: string | null
          file_url?: string | null
          function_length?: number | null
          function_name: string
          github_url?: string | null
          id?: number
          language?: string | null
          llm_score?: number | null
          maintainability?: number | null
          nesting_depth?: number | null
          parameter_count?: number | null
          refactoring_urgency?: number | null
          related_functions_analyzed?: number | null
          semantic_complexity?: number | null
          start_line?: number | null
          suggestions?: Json | null
          total_complexity_score?: number | null
          updated_at?: string | null
        }
        Update: {
          business_description?: string | null
          cognitive_complexity?: number | null
          cognitive_load?: number | null
          combined_complexity_score?: number | null
          created_at?: string | null
          cyclomatic_complexity?: number | null
          developer_description?: string | null
          documentation_quality?: number | null
          documentation_score?: number | null
          end_line?: number | null
          explanation?: string | null
          file_url?: string | null
          function_length?: number | null
          function_name?: string
          github_url?: string | null
          id?: number
          language?: string | null
          llm_score?: number | null
          maintainability?: number | null
          nesting_depth?: number | null
          parameter_count?: number | null
          refactoring_urgency?: number | null
          related_functions_analyzed?: number | null
          semantic_complexity?: number | null
          start_line?: number | null
          suggestions?: Json | null
          total_complexity_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      compliance_rules: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          rule_config: Json | null
          rule_name: string
          severity: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          rule_config?: Json | null
          rule_name: string
          severity?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          rule_config?: Json | null
          rule_name?: string
          severity?: string
        }
        Relationships: []
      }
      disallowed_files: {
        Row: {
          extension: string
          file_url: string
          id: number
          name: string
        }
        Insert: {
          extension: string
          file_url: string
          id?: never
          name: string
        }
        Update: {
          extension?: string
          file_url?: string
          id?: never
          name?: string
        }
        Relationships: []
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
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
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
      function_complexity: {
        Row: {
          combined_complexity_score: number | null
          end_line: number | null
          file_url: string | null
          function_name: string | null
          github_url: string | null
          id: number
          language: string | null
          llm_business_description: string | null
          llm_cognitive_load: number | null
          llm_developer_description: string | null
          llm_documentation_quality: number | null
          llm_explanation: string | null
          llm_maintainability: number | null
          llm_refactoring_urgency: number | null
          llm_score: number | null
          llm_semantic_complexity: number | null
          llm_suggestions: Json | null
          rule_cognitive_complexity: number | null
          rule_cyclomatic_complexity: number | null
          rule_documentation_score: number | null
          rule_function_length: number | null
          rule_nesting_depth: number | null
          rule_parameter_count: number | null
          rule_score: number | null
          start_line: number | null
        }
        Insert: {
          combined_complexity_score?: number | null
          end_line?: number | null
          file_url?: string | null
          function_name?: string | null
          github_url?: string | null
          id?: number
          language?: string | null
          llm_business_description?: string | null
          llm_cognitive_load?: number | null
          llm_developer_description?: string | null
          llm_documentation_quality?: number | null
          llm_explanation?: string | null
          llm_maintainability?: number | null
          llm_refactoring_urgency?: number | null
          llm_score?: number | null
          llm_semantic_complexity?: number | null
          llm_suggestions?: Json | null
          rule_cognitive_complexity?: number | null
          rule_cyclomatic_complexity?: number | null
          rule_documentation_score?: number | null
          rule_function_length?: number | null
          rule_nesting_depth?: number | null
          rule_parameter_count?: number | null
          rule_score?: number | null
          start_line?: number | null
        }
        Update: {
          combined_complexity_score?: number | null
          end_line?: number | null
          file_url?: string | null
          function_name?: string | null
          github_url?: string | null
          id?: number
          language?: string | null
          llm_business_description?: string | null
          llm_cognitive_load?: number | null
          llm_developer_description?: string | null
          llm_documentation_quality?: number | null
          llm_explanation?: string | null
          llm_maintainability?: number | null
          llm_refactoring_urgency?: number | null
          llm_score?: number | null
          llm_semantic_complexity?: number | null
          llm_suggestions?: Json | null
          rule_cognitive_complexity?: number | null
          rule_cyclomatic_complexity?: number | null
          rule_documentation_score?: number | null
          rule_function_length?: number | null
          rule_nesting_depth?: number | null
          rule_parameter_count?: number | null
          rule_score?: number | null
          start_line?: number | null
        }
        Relationships: []
      }
      function_qa: {
        Row: {
          ai_response_style: string | null
          answer: string | null
          approved_at: string | null
          approved_by: string | null
          business_context: string | null
          created_at: string
          function_id: string
          function_name: string
          id: string
          is_approved: boolean | null
          question: string
          question_type: string
          regeneration_source: string | null
          repository_id: string
          source_chat_id: string | null
          tags: string[] | null
          technical_context: string | null
          updated_at: string
          view_mode: string | null
        }
        Insert: {
          ai_response_style?: string | null
          answer?: string | null
          approved_at?: string | null
          approved_by?: string | null
          business_context?: string | null
          created_at?: string
          function_id: string
          function_name: string
          id?: string
          is_approved?: boolean | null
          question: string
          question_type: string
          regeneration_source?: string | null
          repository_id: string
          source_chat_id?: string | null
          tags?: string[] | null
          technical_context?: string | null
          updated_at?: string
          view_mode?: string | null
        }
        Update: {
          ai_response_style?: string | null
          answer?: string | null
          approved_at?: string | null
          approved_by?: string | null
          business_context?: string | null
          created_at?: string
          function_id?: string
          function_name?: string
          id?: string
          is_approved?: boolean | null
          question?: string
          question_type?: string
          regeneration_source?: string | null
          repository_id?: string
          source_chat_id?: string | null
          tags?: string[] | null
          technical_context?: string | null
          updated_at?: string
          view_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "function_qa_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "function_qa_source_chat_id_fkey"
            columns: ["source_chat_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      matrix: {
        Row: {
          content: string | null
          id: string
        }
        Insert: {
          content?: string | null
          id?: string
        }
        Update: {
          content?: string | null
          id?: string
        }
        Relationships: []
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
      technical_debt_assessments: {
        Row: {
          assessment_data: Json | null
          assessment_name: string
          compliance_score: number
          created_at: string | null
          id: string
          maintainability_score: number
          overall_score: number
          performance_score: number
          repository_id: string
          security_score: number
          updated_at: string | null
        }
        Insert: {
          assessment_data?: Json | null
          assessment_name: string
          compliance_score?: number
          created_at?: string | null
          id?: string
          maintainability_score?: number
          overall_score?: number
          performance_score?: number
          repository_id: string
          security_score?: number
          updated_at?: string | null
        }
        Update: {
          assessment_data?: Json | null
          assessment_name?: string
          compliance_score?: number
          created_at?: string | null
          id?: string
          maintainability_score?: number
          overall_score?: number
          performance_score?: number
          repository_id?: string
          security_score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_debt_assessments_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      tll: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: string
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
        }
        Relationships: []
      }
      tool_requirements: {
        Row: {
          compliance_notes: string | null
          created_at: string | null
          current_version: string | null
          id: string
          repository_id: string
          required_version: string | null
          status: string
          tool_name: string
          updated_at: string | null
        }
        Insert: {
          compliance_notes?: string | null
          created_at?: string | null
          current_version?: string | null
          id?: string
          repository_id: string
          required_version?: string | null
          status?: string
          tool_name: string
          updated_at?: string | null
        }
        Update: {
          compliance_notes?: string | null
          created_at?: string | null
          current_version?: string | null
          id?: string
          repository_id?: string
          required_version?: string | null
          status?: string
          tool_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_requirements_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          content: string | null
          embedding: string | null
          id: string
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
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
