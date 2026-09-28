export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {

  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "checkins": {
                  Row: {
                    "created_at": string,"id": string,"local_checkin_date": string,"note": string | null,"submitted_at": string,"trainee_id": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"local_checkin_date": string,"note"?: string | null,"submitted_at"?: string,"trainee_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"local_checkin_date"?: string,"note"?: string | null,"submitted_at"?: string,"trainee_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "checkins_trainee_id_fkey"
      columns: ["trainee_id"]
isOneToOne: false
      referencedRelation: "trainee_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"inbody_records": {
                  Row: {
                    "body_fat_mass_kg": number,"created_at": string,"id": string,"is_manually_edited": boolean,"percent_body_fat": number,"pt_id": string,"recorded_at": string,"skeletal_muscle_mass_kg": number,"source": Database["public"]['Enums']["inbody_source"],"target_calories": number | null,"target_carb_grams": number | null,"target_fat_grams": number | null,"target_protein_grams": number | null,"total_body_water_liters": number | null,"trainee_id": string,"verified_by": string,"weight_kg": number
                  }
                  Insert: {
                    "body_fat_mass_kg": number,"created_at"?: string,"id"?: string,"is_manually_edited"?: boolean,"percent_body_fat": number,"pt_id": string,"recorded_at"?: string,"skeletal_muscle_mass_kg": number,"source"?: Database["public"]['Enums']["inbody_source"],"target_calories"?: number | null,"target_carb_grams"?: number | null,"target_fat_grams"?: number | null,"target_protein_grams"?: number | null,"total_body_water_liters"?: number | null,"trainee_id": string,"verified_by": string,"weight_kg": number
                  }
                  Update: {
                    "body_fat_mass_kg"?: number,"created_at"?: string,"id"?: string,"is_manually_edited"?: boolean,"percent_body_fat"?: number,"pt_id"?: string,"recorded_at"?: string,"skeletal_muscle_mass_kg"?: number,"source"?: Database["public"]['Enums']["inbody_source"],"target_calories"?: number | null,"target_carb_grams"?: number | null,"target_fat_grams"?: number | null,"target_protein_grams"?: number | null,"total_body_water_liters"?: number | null,"trainee_id"?: string,"verified_by"?: string,"weight_kg"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "inbody_records_pt_id_fkey"
      columns: ["pt_id"]
isOneToOne: false
      referencedRelation: "pt_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "inbody_records_trainee_id_fkey"
      columns: ["trainee_id"]
isOneToOne: false
      referencedRelation: "trainee_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "inbody_records_verified_by_fkey"
      columns: ["verified_by"]
isOneToOne: false
      referencedRelation: "pt_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"meal_logs": {
                  Row: {
                    "checkin_id": string,"created_at": string,"id": string,"photo_mime_type": string,"photo_size_bytes": number,"private_photo_path": string,"trainee_id": string
                  }
                  Insert: {
                    "checkin_id": string,"created_at"?: string,"id"?: string,"photo_mime_type": string,"photo_size_bytes": number,"private_photo_path": string,"trainee_id": string
                  }
                  Update: {
                    "checkin_id"?: string,"created_at"?: string,"id"?: string,"photo_mime_type"?: string,"photo_size_bytes"?: number,"private_photo_path"?: string,"trainee_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "meal_logs_checkin_id_fkey"
      columns: ["checkin_id"]
isOneToOne: true
      referencedRelation: "checkins"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "meal_logs_trainee_id_fkey"
      columns: ["trainee_id"]
isOneToOne: false
      referencedRelation: "trainee_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"ocr_attempts": {
                  Row: {
                    "created_at": string,"error_code": string | null,"id": string,"image_mime_type": string,"image_size_bytes": number,"inbody_record_id": string | null,"is_confirmed": boolean,"private_image_path": string,"provider": string,"provider_version": string,"pt_id": string,"raw_draft": Json | null,"status": Database["public"]['Enums']["ocr_attempt_status"],"trainee_id": string,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"error_code"?: string | null,"id"?: string,"image_mime_type": string,"image_size_bytes": number,"inbody_record_id"?: string | null,"is_confirmed"?: boolean,"private_image_path": string,"provider": string,"provider_version": string,"pt_id": string,"raw_draft"?: Json | null,"status"?: Database["public"]['Enums']["ocr_attempt_status"],"trainee_id": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"error_code"?: string | null,"id"?: string,"image_mime_type"?: string,"image_size_bytes"?: number,"inbody_record_id"?: string | null,"is_confirmed"?: boolean,"private_image_path"?: string,"provider"?: string,"provider_version"?: string,"pt_id"?: string,"raw_draft"?: Json | null,"status"?: Database["public"]['Enums']["ocr_attempt_status"],"trainee_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
                      foreignKeyName: "ocr_attempts_inbody_record_id_fkey"
                      columns: ["inbody_record_id"]
                      isOneToOne: true
                      referencedRelation: "inbody_records"
                      referencedColumns: ["id"]
                    },
                    {
                      foreignKeyName: "ocr_attempts_pt_id_fkey"
                      columns: ["pt_id"]
                      isOneToOne: false
                      referencedRelation: "pt_profiles"
                      referencedColumns: ["id"]
                    },
                    {
                      foreignKeyName: "ocr_attempts_trainee_id_fkey"
                      columns: ["trainee_id"]
                      isOneToOne: false
                      referencedRelation: "trainee_profiles"
                      referencedColumns: ["id"]
                    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"display_name": string,"id": string,"phone": string | null,"role": Database["public"]['Enums']["user_role"],"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"display_name": string,"id": string,"phone"?: string | null,"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"display_name"?: string,"id"?: string,"phone"?: string | null,"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Relationships: [

                  ]
                },"pt_profiles": {
                  Row: {
                    "created_at": string,"gym_affiliation": string | null,"id": string,"subscription_plan": Database["public"]['Enums']["subscription_plan"],"subscription_valid_until": string | null,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"gym_affiliation"?: string | null,"id": string,"subscription_plan"?: Database["public"]['Enums']["subscription_plan"],"subscription_valid_until"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"gym_affiliation"?: string | null,"id"?: string,"subscription_plan"?: Database["public"]['Enums']["subscription_plan"],"subscription_valid_until"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "pt_profiles_id_fkey"
      columns: ["id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"trainee_invitations": {
                  Row: {
                    "accepted_at": string | null,"accepted_by": string | null,"created_at": string,"email": string,"expires_at": string,"id": string,"pt_id": string,"status": Database["public"]['Enums']["invitation_status"],"token_hash": string,"trainee_id": string | null,"updated_at": string
                  }
                  Insert: {
                    "accepted_at"?: string | null,"accepted_by"?: string | null,"created_at"?: string,"email": string,"expires_at": string,"id"?: string,"pt_id": string,"status"?: Database["public"]['Enums']["invitation_status"],"token_hash": string,"trainee_id"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "accepted_at"?: string | null,"accepted_by"?: string | null,"created_at"?: string,"email"?: string,"expires_at"?: string,"id"?: string,"pt_id"?: string,"status"?: Database["public"]['Enums']["invitation_status"],"token_hash"?: string,"trainee_id"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trainee_invitations_accepted_by_fkey"
      columns: ["accepted_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trainee_invitations_pt_id_fkey"
      columns: ["pt_id"]
isOneToOne: false
      referencedRelation: "pt_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trainee_invitations_trainee_id_fkey"
      columns: ["trainee_id"]
isOneToOne: false
      referencedRelation: "trainee_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"trainee_profiles": {
                  Row: {
                    "archived_at": string | null,"assigned_pt_id": string,"created_at": string,"display_name": string,"engagement_started_on": string | null,"id": string,"last_checkin_date": string | null,"phone": string | null,"primary_goal": Database["public"]['Enums']["fitness_goal"],"profile_id": string | null,"remaining_sessions": number,"status": Database["public"]['Enums']["trainee_status"],"total_sessions": number,"updated_at": string
                  }
                  Insert: {
                    "archived_at"?: string | null,"assigned_pt_id": string,"created_at"?: string,"display_name": string,"engagement_started_on"?: string | null,"id"?: string,"last_checkin_date"?: string | null,"phone"?: string | null,"primary_goal"?: Database["public"]['Enums']["fitness_goal"],"profile_id"?: string | null,"remaining_sessions"?: number,"status"?: Database["public"]['Enums']["trainee_status"],"total_sessions"?: number,"updated_at"?: string
                  }
                  Update: {
                    "archived_at"?: string | null,"assigned_pt_id"?: string,"created_at"?: string,"display_name"?: string,"engagement_started_on"?: string | null,"id"?: string,"last_checkin_date"?: string | null,"phone"?: string | null,"primary_goal"?: Database["public"]['Enums']["fitness_goal"],"profile_id"?: string | null,"remaining_sessions"?: number,"status"?: Database["public"]['Enums']["trainee_status"],"total_sessions"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trainee_profiles_assigned_pt_id_fkey"
      columns: ["assigned_pt_id"]
isOneToOne: false
      referencedRelation: "pt_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trainee_profiles_profile_id_fkey"
      columns: ["profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "accept_trainee_invitation":
{ Args: { "invite_token_hash": string }; Returns: {
              "outcome": string,"trainee_id": string
            }[]
                           },
"application_local_date":
{ Args: { "at_time": string }; Returns: string
                           },
"application_timezone":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"checkin_warning_starts_on":
{ Args: { "reference_date": string }; Returns: string
                           },
"create_trainee_with_invitation":
{ Args: { "invite_email": string,"invite_expires_at": string,"invite_token_hash": string,"package_remaining": number,"package_total": number,"trainee_display_name": string,"trainee_goal": Database["public"]['Enums']["fitness_goal"],"trainee_phone": string }; Returns: string
                           },
"get_invitation_preview":
{ Args: { "invite_token_hash": string }; Returns: {
              "display_name": string,"email": string,"expires_at": string
            }[]
                           },
"is_checkin_warning_due":
{ Args: { "at_time": string,"reference_date": string }; Returns: boolean
                           },
"submit_daily_checkin":
{ Args: { "checkin_note": string,"meal_photo_mime_type"?: string,"meal_photo_path"?: string,"meal_photo_size_bytes"?: number }; Returns: {
              "checkin_id": string,"local_checkin_date": string,"outcome": string
            }[]
                            },
"confirm_ocr_inbody_record":
{ Args: { "attempt_id": string,"confirmed_fat_kg": number,"confirmed_fat_percent": number,"confirmed_muscle_kg": number,"confirmed_water_liters"?: number | null,"confirmed_weight_kg": number,"nutrition_calories"?: number | null,"nutrition_carb"?: number | null,"nutrition_fat"?: number | null,"nutrition_protein"?: number | null }; Returns: {
              "is_manually_edited": boolean,"outcome": string,"record_id": string
            }[]
                           }
          }
          Enums: {
            "fitness_goal": "fat_loss"|"muscle_gain"|"recomp","inbody_source": "manual"|"ocr","invitation_status": "pending"|"accepted"|"revoked"|"expired","ocr_attempt_status": "pending"|"success"|"failed","subscription_plan": "free"|"pro"|"enterprise","trainee_status": "active"|"warning"|"inactive"|"archived","user_role": "pt"|"trainee"|"admin"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {

          }
        },"public": {
          Enums: {
            "fitness_goal": ["fat_loss", "muscle_gain", "recomp"],"inbody_source": ["manual", "ocr"],"invitation_status": ["pending", "accepted", "revoked", "expired"],"ocr_attempt_status": ["pending", "success", "failed"],"subscription_plan": ["free", "pro", "enterprise"],"trainee_status": ["active", "warning", "inactive", "archived"],"user_role": ["pt", "trainee", "admin"]
          }
        }
} as const
