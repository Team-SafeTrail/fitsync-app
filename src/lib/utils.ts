import type { BiometricReading, ComputedNutrition, ClientGoal, Gender } from '@/types';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + 'K';
  }
  return amount.toString();
}

export function computeNutrition(
  biometrics: BiometricReading,
  gender: Gender,
  age: number,
  height_cm: number,
  goal: ClientGoal
): ComputedNutrition {
  // Mifflin-St Jeor BMR
  const bmr =
    gender === 'male'
      ? 10 * biometrics.weight_kg + 6.25 * height_cm - 5 * age + 5
      : 10 * biometrics.weight_kg + 6.25 * height_cm - 5 * age - 161;

  const bmr_kcal = Math.round(bmr);

  // Activity factor: moderate (PT-guided clients train ~4x/week)
  const tdee_kcal = Math.round(bmr * 1.375);

  // Goal adjustment
  let target_calories_kcal: number;
  switch (goal) {
    case 'fat_loss':
      target_calories_kcal = Math.round(tdee_kcal * 0.8);
      break;
    case 'muscle_gain':
      target_calories_kcal = Math.round(tdee_kcal * 1.2);
      break;
    case 'recomp':
    default:
      target_calories_kcal = tdee_kcal;
  }

  // Macro split: Protein 2.2g/kg, Fat 0.8g/kg, Carbs fill remainder
  const protein_grams = Math.round(biometrics.weight_kg * 2.2);
  const fat_grams = Math.round(biometrics.weight_kg * 0.9);
  const protein_cals = protein_grams * 4;
  const fat_cals = fat_grams * 9;
  const carb_cals = Math.max(0, target_calories_kcal - protein_cals - fat_cals);
  const carbohydrate_grams = Math.round(carb_cals / 4);

  return {
    bmr_kcal,
    tdee_kcal,
    target_calories_kcal,
    protein_grams,
    carbohydrate_grams,
    fat_grams,
  };
}

export function getGoalLabel(goal: ClientGoal): string {
  const labels: Record<ClientGoal, string> = {
    fat_loss: 'Fat Loss',
    muscle_gain: 'Muscle Gain',
    recomp: 'Recomp',
  };
  return labels[goal];
}

export function getStatusColor(status: 'active' | 'warning' | 'inactive') {
  switch (status) {
    case 'active':
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'warning':
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'inactive':
      return {
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
      };
  }
}
