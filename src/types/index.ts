// ─── Biometric Types ───────────────────────────────────────────────
export interface BiometricReading {
  weight_kg: number;
  skeletal_muscle_mass_kg: number;
  body_fat_mass_kg: number;
  percent_body_fat: number;
  total_body_water_liters: number | null;
}

export interface ComputedNutrition {
  bmr_kcal: number;
  tdee_kcal: number;
  target_calories_kcal: number;
  protein_grams: number;
  carbohydrate_grams: number;
  fat_grams: number;
}

export interface ScanResult {
  fixture_name: string;
  client_profile: ClientProfile;
  biometrics: BiometricReading;
  nutrition: ComputedNutrition;
  confidence: number;
  scanned_at: string;
}

// ─── Client Types ──────────────────────────────────────────────────
export type ClientGoal = 'fat_loss' | 'muscle_gain' | 'recomp';
export type ClientStatus = 'active' | 'warning' | 'inactive';
export type Gender = 'male' | 'female';

export interface ClientProfile {
  gender: Gender;
  age: number;
  height_cm: number;
  goal: ClientGoal;
}

export interface Client {
  id: string;
  name: string;
  avatar_initial: string;
  profile: ClientProfile;
  status: ClientStatus;
  latest_biometrics: BiometricReading;
  latest_nutrition: ComputedNutrition;
  sessions_remaining: number;
  sessions_total: number;
  last_checkin: string;
  days_inactive: number;
  weight_trend: number;
  bf_trend: number;
  compliance_score: number;
}

// ─── Meal Logging ──────────────────────────────────────────────────
export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  slot: MealSlot;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged_at: string;
  photo_url?: string;
}

// ─── Pricing ───────────────────────────────────────────────────────
export interface PricingTier {
  name: string;
  price_vnd: number;
  price_label: string;
  period: string;
  badge?: string;
  features: string[];
  cta_label: string;
  highlighted: boolean;
}

// ─── OCR Pipeline ──────────────────────────────────────────────────
export type OCRStage =
  | 'idle'
  | 'deskewing'
  | 'anchor_detection'
  | 'biometric_extraction'
  | 'macro_computation'
  | 'complete';

export interface OCRProgress {
  stage: OCRStage;
  percent: number;
  label: string;
}

// ─── Lead Capture ──────────────────────────────────────────────────
export type CoachRole = 'freelance_pt' | 'gym_coach' | 'studio_owner';

export interface LeadFormData {
  name: string;
  phone: string;
  role: CoachRole;
  client_volume: number;
}

// ─── Dashboard Metrics ─────────────────────────────────────────────
export interface DashboardMetrics {
  active_clients: number;
  urgent_alerts: number;
  month_revenue_vnd: number;
  time_saved_hours: number;
}
