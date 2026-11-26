// Scoped Supabase public schema types aligned with PR #48 backend revision 4257334
// Source of truth: apps/web/src/types/database.ts (14 migrations through 20261117150000).

export type UserRole = "pt" | "trainee" | "admin";
export type TraineeStatus = "active" | "warning" | "inactive" | "archived";
export type FitnessGoal = "fat_loss" | "muscle_gain" | "recomp";

export type ProfileRow = {
  id: string;
  role: UserRole;
  display_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type TraineeProfileRow = {
  id: string;
  profile_id: string | null;
  assigned_pt_id: string;
  display_name: string;
  phone: string | null;
  primary_goal: FitnessGoal;
  status: TraineeStatus;
  total_sessions: number;
  remaining_sessions: number;
  last_checkin_date: string | null;
  engagement_started_on: string | null;
  archived_at: string | null;
  roster_version: number;
  session_version: number;
  created_at: string;
  updated_at: string;
};

export type CheckinRow = {
  id: string;
  trainee_id: string;
  local_checkin_date: string;
  note: string | null;
  submitted_at: string;
  created_at: string;
};

export type SubmitDailyCheckinResultRow = {
  checkin_id: string;
  outcome: string;
  local_checkin_date: string;
};

export type AssignedCoachIdentityRow = {
  id: string;
  display_name: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string; display_name: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      trainee_profiles: {
        Row: TraineeProfileRow;
        Insert: Partial<TraineeProfileRow> & { assigned_pt_id: string; display_name: string };
        Update: Partial<TraineeProfileRow>;
        Relationships: [];
      };
      checkins: {
        Row: CheckinRow;
        Insert: Partial<CheckinRow> & { trainee_id: string; local_checkin_date: string };
        Update: Partial<CheckinRow>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      application_local_date: {
        Args: { at_time: string };
        Returns: string;
      };
      application_timezone: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_assigned_coach_identity: {
        Args: Record<PropertyKey, never>;
        Returns: AssignedCoachIdentityRow[];
      };
      submit_daily_checkin: {
        Args: {
          checkin_note: string;
          meal_photo_mime_type?: string;
          meal_photo_path?: string;
          meal_photo_size_bytes?: number;
        };
        Returns: SubmitDailyCheckinResultRow[];
      };
    };
    Enums: {
      fitness_goal: FitnessGoal;
      trainee_status: TraineeStatus;
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
