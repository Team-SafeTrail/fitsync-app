"use client";

import { useState, useRef } from "react";
import { todayMeals } from "@/lib/mock-data";
import type { MealEntry } from "@/types";
import {
  Flame,
  Plus,
  Camera,
  TrendingDown,
  TrendingUp,
  X,
  Check,
  Utensils,
  Sun,
  Moon,
  Coffee,
  Image as ImageIcon,
} from "lucide-react";

const TARGET_CALORIES = 1850;
const TARGET_PROTEIN = 140;
const TARGET_CARBS = 185;
const TARGET_FAT = 52;

const STREAK_DAYS = 13;

export default function TraineePage() {
  const [meals, setMeals] = useState<MealEntry[]>(todayMeals);
  const [showLogModal, setShowLogModal] = useState(false);
  const [defaultSlot, setDefaultSlot] = useState<MealEntry["slot"]>("lunch");

  const consumed = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const caloriePercent = Math.min(
    (consumed.calories / TARGET_CALORIES) * 100,
    100,
  );

  const addMeal = (meal: MealEntry) => {
    setMeals((prev) => [...prev, meal]);
    setShowLogModal(false);
  };

  const openLogWithSlot = (slot: MealEntry["slot"]) => {
    setDefaultSlot(slot);
    setShowLogModal(true);
  };

  return (
    <div className="max-w-[480px] mx-auto p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.015em] text-[var(--color-text-primary)]">
            Xin chào, Linh 👋
          </h1>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
            Hôm nay |{" "}
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        {/* Habit Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-brand-light)] border border-[var(--color-border-accent)] rounded-[var(--radius-full)] shadow-xs">
          <Flame size={16} className="text-amber-500 fill-amber-500" />
          <span className="font-mono text-[14px] font-bold text-amber-700">
            {STREAK_DAYS}
          </span>
          <span className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider">
            Days Active
          </span>
        </div>
      </div>

      {/* Calorie Gauge */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
              Daily Nutrition Target
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Prescribed by Coach Nam
            </p>
          </div>
          <span className="font-mono text-[13px] font-bold text-[var(--color-brand)] bg-[var(--color-brand-light)] px-2 py-0.5 rounded">
            {Math.round(caloriePercent)}%
          </span>
        </div>

        {/* Calorie Progress */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="progress-bar h-3.5 rounded-[var(--radius-full)] bg-[var(--color-surface-muted)]">
              <div
                className={`progress-fill rounded-[var(--radius-full)] ${
                  caloriePercent >= 90
                    ? "bg-[var(--color-success)]"
                    : caloriePercent >= 60
                      ? "bg-[var(--color-brand)]"
                      : "bg-[var(--color-warning)]"
                }`}
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-[22px] font-bold text-[var(--color-text-primary)]">
              {consumed.calories.toLocaleString()}
            </span>
            <span className="text-[12px] text-[var(--color-text-muted)] ml-1">
              / {TARGET_CALORIES.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[var(--color-border-default)]">
          <MacroBar
            label="Protein"
            current={consumed.protein}
            target={TARGET_PROTEIN}
            unit="g"
            color="bg-[var(--color-accent)]"
          />
          <MacroBar
            label="Carbs"
            current={consumed.carbs}
            target={TARGET_CARBS}
            unit="g"
            color="bg-amber-500"
          />
          <MacroBar
            label="Fat"
            current={consumed.fat}
            target={TARGET_FAT}
            unit="g"
            color="bg-rose-500"
          />
        </div>
      </div>

      {/* Body Recomposition Delta */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
            Body Recomposition Delta
          </h2>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            Verified InBody 270
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-success-light)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} className="text-[var(--color-success)]" />
              <span className="text-[11px] text-[var(--color-success)] font-semibold uppercase tracking-wider">
                Weight
              </span>
            </div>
            <span className="font-mono text-[22px] font-bold text-[var(--color-success)]">
              -1.8 kg
            </span>
            <p className="text-[11px] text-[var(--color-success)] font-medium mt-0.5">
              Last 30 days (Fat Loss)
            </p>
          </div>
          <div className="bg-[var(--color-brand-light)] border border-[var(--color-border-accent)] rounded-[var(--radius-md)] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} className="text-[var(--color-brand)]" />
              <span className="text-[11px] text-[var(--color-brand)] font-semibold uppercase tracking-wider">
                SMM Muscle
              </span>
            </div>
            <span className="font-mono text-[22px] font-bold text-[var(--color-brand)]">
              +0.6 kg
            </span>
            <p className="text-[11px] text-[var(--color-brand)] font-medium mt-0.5">
              Last 30 days (Lean Gain)
            </p>
          </div>
        </div>
      </div>

      {/* Meal Log & Rapid Check-in */}
      <div className="card mb-4 p-0">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-default)]">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
              Today&apos;s Meals
            </h2>
            <span className="text-[12px] text-[var(--color-text-muted)]">
              {meals.length} meals recorded
            </span>
          </div>

          {/* Rapid Meal Check-in Button (+ Log Lunch) */}
          <button
            onClick={() => openLogWithSlot("lunch")}
            className="btn-secondary h-[32px] px-3 text-[12px] gap-1 font-semibold hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          >
            <Plus size={13} />+ Log Lunch
          </button>
        </div>

        <div>
          {meals.map((meal) => (
            <MealRow key={meal.id} meal={meal} />
          ))}
        </div>
      </div>

      {/* Primary Log Action CTA */}
      <button
        onClick={() => openLogWithSlot("snack")}
        className="btn-primary w-full h-12 text-[15px] shadow-sm"
      >
        <Plus size={18} />
        Log Another Meal
      </button>

      {/* Log Modal */}
      {showLogModal && (
        <LogMealModal
          initialSlot={defaultSlot}
          onClose={() => setShowLogModal(false)}
          onSave={addMeal}
        />
      )}
    </div>
  );
}

function MacroBar({
  label,
  current,
  target,
  unit,
  color,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
          {label}
        </span>
      </div>
      <div className="progress-bar h-2 bg-[var(--color-surface-muted)]">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1">
        <span className="font-mono text-[12px] font-bold text-[var(--color-text-primary)]">
          {current}
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)]">
          /{target}
          {unit}
        </span>
      </div>
    </div>
  );
}

function MealRow({ meal }: { meal: MealEntry }) {
  const slotIcons: Record<string, React.ReactNode> = {
    breakfast: <Coffee size={14} className="text-amber-500" />,
    lunch: <Sun size={14} className="text-[var(--color-brand)]" />,
    dinner: <Moon size={14} className="text-[var(--color-text-secondary)]" />,
    snack: <Utensils size={14} className="text-[var(--color-accent)]" />,
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border-default)] last:border-b-0 hover:bg-[var(--color-canvas)] transition-colors">
      <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[var(--color-canvas)] border border-[var(--color-border-default)] flex items-center justify-center shrink-0">
        {slotIcons[meal.slot] || <Utensils size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">
          {meal.name}
        </p>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {meal.slot.charAt(0).toUpperCase() + meal.slot.slice(1)} • P:
          {meal.protein}g C:{meal.carbs}g F:{meal.fat}g
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className="font-mono text-[14px] font-bold text-[var(--color-text-primary)]">
          {meal.calories}
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)] ml-0.5">
          kcal
        </span>
      </div>
    </div>
  );
}

function LogMealModal({
  initialSlot = "lunch",
  onClose,
  onSave,
}: {
  initialSlot?: MealEntry["slot"];
  onClose: () => void;
  onSave: (meal: MealEntry) => void;
}) {
  const [name, setName] = useState("");
  const [slot, setSlot] = useState<string>(initialSlot);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickMeals = [
    { name: "Ức gà áp chảo + Cơm gạo lứt", cal: 520, p: 42, c: 48, f: 14 },
    { name: "Cơm tấm sườn bì chả", cal: 650, p: 35, c: 68, f: 24 },
    { name: "Phở bò tái nạm", cal: 480, p: 28, c: 52, f: 16 },
    { name: "Bún bò Huế nạc", cal: 450, p: 28, c: 50, f: 15 },
  ];

  const handleQuickSelect = (meal: (typeof quickMeals)[0]) => {
    setName(meal.name);
    setCalories(meal.cal.toString());
    setProtein(meal.p.toString());
    setCarbs(meal.c.toString());
    setFat(meal.f.toString());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const triggerSimulatedPhoto = () => {
    if (photoPreview) {
      setPhotoPreview(null);
    } else {
      // Use clean inline SVG mock photo preview
      setPhotoPreview("mock_meal_photo");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `m-${Date.now()}`,
      slot: slot as MealEntry["slot"],
      name: name || "Bữa ăn dinh dưỡng",
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      logged_at: new Date().toISOString(),
    });
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-meal-title"
    >
      <div
        className="fixed inset-0 bg-black/70"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) =>
          (e.key === "Escape" || e.key === "Enter") && onClose()
        }
        aria-label="Close dialog overlay"
      />
      <div className="modal-content relative z-10 max-w-[420px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              id="log-meal-title"
              className="text-[17px] font-semibold text-[var(--color-text-primary)]"
            >
              Check-in Bữa Ăn
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Chọn ảnh để xem trước luồng check-in mô phỏng
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 hover:bg-[var(--color-canvas)] rounded-[var(--radius-base)] transition-colors border-none bg-transparent cursor-pointer"
          >
            <X size={18} className="text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Photo Upload Preview */}
        <input
          id="trainee-food-photo-input"
          name="foodPhoto"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {photoPreview ? (
          <div className="relative mb-4 rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-success-light)] p-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[var(--radius-base)] bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] flex items-center justify-center shrink-0">
                <ImageIcon size={24} className="text-[var(--color-success)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[var(--color-text-primary)] truncate">
                  meal_checkin_{slot}.jpg
                </p>
                <p className="text-[11px] text-[var(--color-success)]">
                  Ảnh minh họa đã được đính kèm
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                aria-label="Remove attached photo"
                className="p-1.5 hover:bg-[var(--color-surface-elevated)] rounded text-[var(--color-success)] border-none bg-transparent cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border-default)] hover:border-[var(--color-brand)] bg-[var(--color-canvas)] transition-colors cursor-pointer text-[12px] text-[var(--color-text-secondary)] font-medium"
            >
              <Camera size={16} className="text-[var(--color-brand)]" />
              Upload Food Photo
            </button>
            <button
              type="button"
              onClick={triggerSimulatedPhoto}
              className="px-3 h-[48px] rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] hover:bg-[var(--color-surface-elevated)] text-[11px] font-medium text-[var(--color-text-muted)] cursor-pointer"
              title="Simulate quick snap"
            >
              Quick Snap
            </button>
          </div>
        )}

        {/* Quick Picks */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
            Món ăn Việt Nam phổ biến
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickMeals.map((qm) => (
              <button
                key={qm.name}
                type="button"
                onClick={() => handleQuickSelect(qm)}
                className={`text-left p-2.5 rounded-[var(--radius-base)] border transition-all cursor-pointer text-[12px] ${
                  name === qm.name
                    ? "bg-[var(--color-brand-light)] border-[var(--color-border-accent)] font-semibold"
                    : "bg-[var(--color-surface-muted)] border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                <p className="text-[var(--color-text-primary)] truncate">
                  {qm.name}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-mono">
                  {qm.cal} kcal • P:{qm.p}g
                </p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="meal-name-input"
                className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer"
              >
                Tên món ăn
              </label>
              <input
                id="meal-name-input"
                name="mealName"
                className="input h-[34px] text-[13px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cơm gà luộc"
                required
              />
            </div>
            <div>
              <label
                htmlFor="meal-slot-select"
                className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer"
              >
                Bữa ăn
              </label>
              <select
                id="meal-slot-select"
                name="mealSlot"
                className="input h-[34px] text-[13px] cursor-pointer font-medium"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
              >
                <option value="breakfast">Breakfast (Sáng)</option>
                <option value="lunch">Lunch (Trưa)</option>
                <option value="dinner">Dinner (Tối)</option>
                <option value="snack">Snack (Phụ)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label
                htmlFor="meal-cal-input"
                className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer"
              >
                Calories
              </label>
              <input
                id="meal-cal-input"
                name="calories"
                type="number"
                className="input h-[34px] text-[13px] font-mono"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="kcal"
                required
              />
            </div>
            <div>
              <label
                htmlFor="meal-protein-input"
                className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer"
              >
                Protein
              </label>
              <input
                id="meal-protein-input"
                name="protein"
                type="number"
                className="input h-[34px] text-[13px] font-mono"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="g"
              />
            </div>
            <div>
              <label
                htmlFor="meal-carbs-input"
                className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer"
              >
                Carbs
              </label>
              <input
                id="meal-carbs-input"
                name="carbs"
                type="number"
                className="input h-[34px] text-[13px] font-mono"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="g"
              />
            </div>
            <div>
              <label
                htmlFor="meal-fat-input"
                className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer"
              >
                Fat
              </label>
              <input
                id="meal-fat-input"
                name="fat"
                type="number"
                className="input h-[34px] text-[13px] font-mono"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="g"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full h-[40px] mt-2">
            <Check size={16} />
            Lưu Bữa Ăn &amp; Cập Nhật Macro
          </button>
        </form>
      </div>
    </div>
  );
}
