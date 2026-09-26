'use client';

import { useState, useEffect, useCallback } from 'react';
import { scanFixtures } from '@/lib/mock-data';
import { computeNutrition } from '@/lib/utils';
import type { OCRStage, BiometricReading, ComputedNutrition } from '@/types';
import { FileText, Smartphone, CheckCircle2, Loader2, Edit3 } from 'lucide-react';

const OCR_STAGES: { stage: OCRStage; label: string; duration: number }[] = [
  { stage: 'deskewing', label: 'Deskewing Image...', duration: 500 },
  { stage: 'anchor_detection', label: 'Anchor Detection...', duration: 600 },
  { stage: 'biometric_extraction', label: 'Biometric Extraction...', duration: 800 },
  { stage: 'macro_computation', label: 'Vietnamese Macro Computation...', duration: 600 },
];

export default function OCRDemoSection() {
  const [selectedFixture, setSelectedFixture] = useState<number | null>(0);
  const [stage, setStage] = useState<OCRStage>('complete');
  const [stageIndex, setStageIndex] = useState(OCR_STAGES.length);
  const [biometrics, setBiometrics] = useState<BiometricReading | null>(scanFixtures[0].biometrics);
  const [nutrition, setNutrition] = useState<ComputedNutrition | null>(scanFixtures[0].nutrition);
  const [confidence, setConfidence] = useState(scanFixtures[0].confidence);

  const runSimulation = useCallback((fixtureIdx: number) => {
    const fixture = scanFixtures[fixtureIdx];
    setSelectedFixture(fixtureIdx);
    setStage('idle');
    setStageIndex(0);
    setBiometrics(null);
    setNutrition(null);

    let cumulativeDelay = 200;
    OCR_STAGES.forEach((s, i) => {
      setTimeout(() => {
        setStage(s.stage);
        setStageIndex(i);
      }, cumulativeDelay);
      cumulativeDelay += s.duration;
    });

    setTimeout(() => {
      setStage('complete');
      setStageIndex(OCR_STAGES.length);
      setBiometrics({ ...fixture.biometrics });
      setNutrition({ ...fixture.nutrition });
      setConfidence(fixture.confidence);
    }, cumulativeDelay);
  }, []);

  const handleBiometricChange = (key: keyof BiometricReading, value: number) => {
    if (!biometrics) return;
    const updated = { ...biometrics, [key]: value };
    setBiometrics(updated);

    const fixture = scanFixtures[selectedFixture!];
    const recomputed = computeNutrition(
      updated,
      fixture.client_profile.gender,
      fixture.client_profile.age,
      fixture.client_profile.height_cm,
      fixture.client_profile.goal
    );
    setNutrition(recomputed);
  };

  return (
    <section id="demo" className="py-16 px-6 bg-[var(--color-canvas)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <span className="section-caption text-[var(--color-accent)] mb-2 block">
            Interactive Demo
          </span>
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] mb-3">
            AI InBody OCR Scanner
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[500px] mx-auto">
            Select a sample scan to see real-time biometric extraction and Vietnamese macro computation.
          </p>
        </div>

        {/* Scan Selector */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          {scanFixtures.map((fixture, idx) => (
            <button
              key={fixture.fixture_name}
              onClick={() => runSimulation(idx)}
              className={`flex items-center gap-3 px-5 py-3 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer bg-white ${
                selectedFixture === idx
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand-light)]'
                  : 'border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              {idx < 2 ? (
                <FileText size={20} className="text-[var(--color-brand)] shrink-0" />
              ) : (
                <Smartphone size={20} className="text-[var(--color-brand)] shrink-0" />
              )}
              <div>
                <div className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                  {fixture.fixture_name}
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  {fixture.client_profile.gender === 'male' ? '♂' : '♀'}{' '}
                  {fixture.client_profile.age}yo •{' '}
                  {fixture.client_profile.goal.replace('_', ' ')}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Processing / Results */}
        {selectedFixture !== null && (
          <div className="card max-w-[900px] mx-auto">
            {stage !== 'complete' ? (
              <ProcessingView stage={stage} stageIndex={stageIndex} />
            ) : (
              <ResultsView
                biometrics={biometrics!}
                nutrition={nutrition!}
                confidence={confidence}
                onBiometricChange={handleBiometricChange}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ProcessingView({
  stage,
  stageIndex,
}: {
  stage: OCRStage;
  stageIndex: number;
}) {
  return (
    <div className="py-8">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Loader2 size={20} className="text-[var(--color-brand)] animate-spin" />
        <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">
          Processing Scan...
        </span>
      </div>

      <div className="max-w-[400px] mx-auto space-y-3">
        {OCR_STAGES.map((s, i) => (
          <div key={s.stage} className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {i < stageIndex ? (
                <CheckCircle2 size={16} className="text-[var(--color-success)]" />
              ) : i === stageIndex ? (
                <Loader2 size={14} className="text-[var(--color-brand)] animate-spin" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-[var(--color-border-default)]" />
              )}
            </div>
            <span
              className={`text-[13px] ${
                i <= stageIndex
                  ? 'text-[var(--color-text-primary)] font-medium'
                  : 'text-[var(--color-text-muted)]'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="progress-bar max-w-[400px] mx-auto mt-6">
        <div
          className="progress-fill bg-[var(--color-brand)]"
          style={{ width: `${((stageIndex + 1) / (OCR_STAGES.length + 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ResultsView({
  biometrics,
  nutrition,
  confidence,
  onBiometricChange,
}: {
  biometrics: BiometricReading;
  nutrition: ComputedNutrition;
  confidence: number;
  onBiometricChange: (key: keyof BiometricReading, value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={20} className="text-[var(--color-success)]" />
          <span className="text-[15px] font-semibold">Extraction Complete</span>
        </div>
        <span className={`badge ${confidence >= 96 ? 'badge-active' : 'badge-warning'}`}>
          Confidence: {confidence}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biometrics */}
        <div>
          <h4 className="section-caption mb-3 flex items-center gap-2">
            <Edit3 size={12} />
            Extracted Biometrics (Editable)
          </h4>
          <div className="space-y-2">
            <EditableMetric
              label="Weight"
              value={biometrics.weight_kg}
              unit="kg"
              onChange={(v) => onBiometricChange('weight_kg', v)}
            />
            <EditableMetric
              label="SMM"
              value={biometrics.skeletal_muscle_mass_kg}
              unit="kg"
              onChange={(v) => onBiometricChange('skeletal_muscle_mass_kg', v)}
            />
            <EditableMetric
              label="Body Fat"
              value={biometrics.body_fat_mass_kg}
              unit="kg"
              onChange={(v) => onBiometricChange('body_fat_mass_kg', v)}
            />
            <EditableMetric
              label="PBF"
              value={biometrics.percent_body_fat}
              unit="%"
              onChange={(v) => onBiometricChange('percent_body_fat', v)}
            />
            {biometrics.total_body_water_liters !== null && (
              <EditableMetric
                label="TBW"
                value={biometrics.total_body_water_liters}
                unit="L"
                onChange={(v) => onBiometricChange('total_body_water_liters', v)}
              />
            )}
          </div>
        </div>

        {/* Computed Nutrition */}
        <div>
          <h4 className="section-caption mb-3">Computed Nutrition Plan</h4>
          <div className="space-y-2">
            <NutritionRow label="BMR" value={nutrition.bmr_kcal} unit="kcal" color="text-[var(--color-text-primary)]" />
            <NutritionRow label="TDEE" value={nutrition.tdee_kcal} unit="kcal" color="text-[var(--color-text-primary)]" />
            <NutritionRow
              label="Target Calories"
              value={nutrition.target_calories_kcal}
              unit="kcal"
              color="text-[var(--color-brand)]"
              bold
            />
            <div className="border-t border-[var(--color-border-default)] pt-2 mt-2">
              <NutritionRow label="Protein" value={nutrition.protein_grams} unit="g" color="text-[var(--color-accent)]" />
              <NutritionRow label="Carbs" value={nutrition.carbohydrate_grams} unit="g" color="text-amber-600" />
              <NutritionRow label="Fat" value={nutrition.fat_grams} unit="g" color="text-rose-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableMetric({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const inputId = `ocr-metric-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[var(--radius-base)] bg-[var(--color-canvas)] border border-[var(--color-border-default)]">
      <label htmlFor={inputId} className="text-[13px] text-[var(--color-text-secondary)] cursor-pointer">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-[70px] h-[28px] text-right font-mono text-[14px] font-semibold bg-white border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-2 focus:border-[var(--color-brand)] outline-none text-[var(--color-text-primary)]"
          step="0.1"
          aria-label={label}
        />
        <span className="text-[11px] text-[var(--color-text-muted)] w-[24px]">{unit}</span>
      </div>
    </div>
  );
}

function NutritionRow({
  label,
  value,
  unit,
  color,
  bold,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-[var(--color-text-secondary)]">{label}</span>
      <span
        className={`font-mono text-[14px] ${color} ${bold ? 'font-bold text-[16px]' : 'font-semibold'}`}
      >
        {value.toLocaleString()} <span className="text-[11px] text-[var(--color-text-muted)]">{unit}</span>
      </span>
    </div>
  );
}
