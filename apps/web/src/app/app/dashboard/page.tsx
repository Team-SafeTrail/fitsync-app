"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useApp } from "@/lib/context";
import { scanFixtures } from "@/lib/mock-data";
import {
  getGoalLabel,
  getStatusColor,
  computeNutrition,
  cn,
} from "@/lib/utils";
import type { Client, BiometricReading, ComputedNutrition } from "@/types";
import {
  Users,
  AlertTriangle,
  Clock,
  Search,
  ScanLine,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  X,
  CheckCircle2,
  Edit3,
  FileText,
  Smartphone,
  Loader2,
  Upload,
  Check,
} from "lucide-react";

export default function DashboardPage() {
  const { clients } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "warning"
  >("all");
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [selectedClientForScan, setSelectedClientForScan] =
    useState<Client | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const warningClients = clients.filter((c) => c.days_inactive >= 3);
  const activeClients = clients.filter((c) => c.status === "active").length;
  const remainingSessions = clients.reduce((total, c) => total + c.sessions_remaining, 0);
  const inbodyProfiles = clients.filter((c) => c.latest_biometrics).length;

  const openScanModal = (client?: Client) => {
    setSelectedClientForScan(client || null);
    setScanModalOpen(true);
  };

  const handleZaloNudge = (client: Client) => {
    const text = `Chào ${client.name}, Coach Nam (FitSync) đây! Thấy em đã ${client.days_inactive} ngày chưa log bữa ăn/check-in. Hôm nay lịch tập thế nào em ơi?`;
    navigator.clipboard.writeText(text);
    setToastMessage(`Đã sao chép lời nhắc cho ${client.name}.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="fs-tour-page fs-tour-dashboard p-4 sm:p-6 lg:p-8">
      {/* Toast Notice */}
      {toastMessage && (
        <div role="status" className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] text-[13px] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)]">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            aria-label="Đóng thông báo"
            className="ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border-none bg-transparent cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
            Tổng quan học viên
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--color-text-secondary)] mt-0.5">
            Một lượt xem nhanh roster, tín hiệu cần theo dõi và bản ghi InBody mẫu.
          </p>
        </div>
        <button
          className="btn-primary self-start sm:self-auto"
          onClick={() => openScanModal()}
        >
          <ScanLine size={16} />
          Xem luồng InBody
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KPICard
          icon={<Users size={18} />}
          label="Đang theo dõi"
          value={activeClients.toString()}
          iconColor="text-[var(--color-brand)]"
          bgColor="bg-[var(--color-brand-light)]"
        />
        <KPICard
          icon={<AlertTriangle size={18} />}
          label="Cần theo dõi"
          value={`${warningClients.length} học viên`}
          iconColor="text-[var(--color-warning)]"
          bgColor="bg-[var(--color-warning-light)]"
        />
        <KPICard
          icon={<Clock size={18} />}
          label="Buổi còn lại"
          value={`${remainingSessions} buổi`}
          iconColor="text-[var(--color-success)]"
          bgColor="bg-[var(--color-success-light)]"
        />
        <KPICard
          icon={<ScanLine size={18} />}
          label="Hồ sơ có InBody"
          value={`${inbodyProfiles} hồ sơ`}
          iconColor="text-[var(--color-accent)]"
          bgColor="bg-[var(--color-accent-light)]"
        />
      </div>

      {/* Inactivity Alerts */}
      {warningClients.length > 0 && (
        <div className="mb-6 bg-[var(--color-warning-light)] border border-[var(--color-border-accent)] rounded-[var(--radius-md)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-[var(--color-warning)]" />
            <span className="text-[13px] font-semibold text-[var(--color-warning)]">
              Cần theo dõi, từ 3 ngày chưa check-in
            </span>
          </div>
          <div className="space-y-2">
            {warningClients.map((client) => (
              <div
                key={client.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface)] rounded-[var(--radius-base)] border border-[var(--color-border-default)] px-4 py-2.5 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-warning-light)] border border-amber-200 flex items-center justify-center text-[11px] font-bold text-[var(--color-warning)] shrink-0">
                    {client.avatar_initial}
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                      {client.name}
                    </span>
                    <span className="text-[12px] text-[var(--color-warning)] ml-2 font-medium">
                      <span aria-hidden="true"> · </span>{client.days_inactive} ngày chưa check-in
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleZaloNudge(client)}
                  className="btn-secondary h-[32px] px-3 text-[12px] gap-1.5 self-end sm:self-auto hover:border-amber-300"
                >
                  <MessageCircle
                    size={13}
                    className="text-[var(--color-brand)]"
                  />
                  Sao chép lời nhắc
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Roster */}
      <div className="card p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[var(--color-border-default)] gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
              Danh sách học viên
            </h2>
            <span className="badge bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] text-[11px]">
              {filteredClients.length} hồ sơ
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1">
              {(["all", "active", "warning"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "h-[28px] px-3 text-[12px] font-medium rounded-[var(--radius-base)] border transition-colors cursor-pointer",
                    statusFilter === status
                      ? "bg-[var(--color-brand-light)] text-[var(--color-brand)] border-[var(--color-border-accent)] font-semibold"
                      : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] border-[var(--color-border-default)] hover:bg-[var(--color-surface-elevated)]",
                  )}
                >
                  {status === "all" ? "Tất cả" : status === "active" ? "Đang hoạt động" : "Cần theo dõi"}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                id="dashboard-search-clients"
                name="searchClients"
                type="text"
                placeholder="Tìm học viên"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Tìm học viên"
                className="input h-[32px] pl-8 pr-3 text-[13px] w-full sm:w-[200px]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Mục tiêu</th>
                <th className="text-right">Cân nặng</th>
                <th className="text-right">Mỡ cơ thể</th>
                <th className="text-right">Buổi tập</th>
                <th>Trạng thái</th>
                <th className="text-right">Tuân thủ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => {
                const statusColors = getStatusColor(client.status);
                return (
                  <tr key={client.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] flex items-center justify-center text-[11px] font-bold text-[var(--color-text-secondary)] shrink-0">
                          {client.avatar_initial}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
                            {client.name}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)]">
                            {client.profile.gender === "male" ? "♂" : "♀"}{" "}
                            {client.profile.age} tuổi<span aria-hidden="true"> · </span>{client.profile.height_cm} cm
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">
                        {getGoalLabel(client.profile.goal)}
                      </span>
                    </td>
                    <td className="numeric">
                      <div>
                        <span className="text-[13px] font-semibold">
                          {client.latest_biometrics.weight_kg}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)] ml-1">
                          kg
                        </span>
                        <TrendIndicator
                          value={client.weight_trend}
                          invertColor
                        />
                      </div>
                    </td>
                    <td className="numeric">
                      <div>
                        <span className="text-[13px] font-semibold">
                          {client.latest_biometrics.percent_body_fat}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)] ml-1">
                          %
                        </span>
                        <TrendIndicator value={client.bf_trend} invertColor />
                      </div>
                    </td>
                    <td className="numeric">
                      <span className="text-[13px] font-semibold">
                        {client.sessions_remaining}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        /{client.sessions_total}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}
                        />
                        {client.status === "active"
                          ? "Đang hoạt động"
                          : `${client.days_inactive} ngày chưa check-in`}
                      </span>
                    </td>
                    <td className="numeric">
                      <div className="flex items-center justify-end gap-2">
                        <div className="progress-bar w-[48px]">
                          <div
                            className={`progress-fill ${
                              client.compliance_score >= 80
                                ? "bg-[var(--color-success)]"
                                : client.compliance_score >= 60
                                  ? "bg-[var(--color-warning)]"
                                  : "bg-[var(--color-destructive)]"
                            }`}
                            style={{ width: `${client.compliance_score}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold w-[32px] text-right">
                          {client.compliance_score}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => openScanModal(client)}
                        className="btn-secondary h-[28px] px-2.5 text-[11px] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                      >
                        <ScanLine size={12} />
                        Xem InBody
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="py-12 text-center text-[14px] text-[var(--color-text-muted)]">
            Không tìm thấy học viên phù hợp.
          </div>
        )}
      </div>

      {/* Scan Modal */}
      {scanModalOpen && (
        <ScanModal
          client={selectedClientForScan}
          onClose={() => setScanModalOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function KPICard({
  icon,
  label,
  value,
  iconColor,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <div className="card flex items-start gap-3 p-4">
      <div
        className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${bgColor} ${iconColor}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="font-mono text-[18px] sm:text-[20px] font-bold text-[var(--color-text-primary)] mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

function TrendIndicator({
  value,
  invertColor,
}: {
  value: number;
  invertColor?: boolean;
}) {
  if (value === 0) return null;
  const isNegative = value < 0;
  const isGood = invertColor ? isNegative : !isNegative;
  return (
    <span
      className={`inline-flex items-center ml-1 text-[11px] font-medium ${isGood ? "text-[var(--color-success)]" : "text-[var(--color-destructive)]"}`}
    >
      {isNegative ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
      <span className="ml-0.5">{Math.abs(value).toFixed(1)}</span>
    </span>
  );
}

function ScanModal({
  client,
  onClose,
}: {
  client: Client | null;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const { clients, updateClientScan } = useApp();
  const [selectedFixture, setSelectedFixture] = useState<number | null>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [biometrics, setBiometrics] = useState<BiometricReading | null>(
    scanFixtures[0].biometrics,
  );
  const [nutrition, setNutrition] = useState<ComputedNutrition | null>(
    scanFixtures[0].nutrition,
  );
  const [saved, setSaved] = useState(false);
  const [targetClient, setTargetClient] = useState(
    client?.id || (clients[0]?.id ?? ""),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const handleSelectFixture = (idx: number) => {
    setSelectedFixture(idx);
    setUploadedFileName(null);
    setProcessing(true);
    setSaved(false);

    setTimeout(() => {
      const fixture = scanFixtures[idx];
      setBiometrics({ ...fixture.biometrics });
      setNutrition({ ...fixture.nutrition });
      setProcessing(false);
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setSelectedFixture(null);
    setProcessing(true);
    setSaved(false);

    setTimeout(() => {
      // The prototype always loads a local fixture; it does not inspect the file.
      const fixture = scanFixtures[0];
      setBiometrics({ ...fixture.biometrics });
      setNutrition({ ...fixture.nutrition });
      setProcessing(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!biometrics || !nutrition || !targetClient) return;
    updateClientScan(targetClient, biometrics, nutrition);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleBiometricChange = (
    key: keyof BiometricReading,
    value: number,
  ) => {
    if (!biometrics) return;
    const updated = { ...biometrics, [key]: value };
    setBiometrics(updated);

    const activeClientObj = clients.find((c) => c.id === targetClient);
    const gender = activeClientObj?.profile.gender ?? "male";
    const age = activeClientObj?.profile.age ?? 28;
    const height_cm = activeClientObj?.profile.height_cm ?? 175;
    const goal = activeClientObj?.profile.goal ?? "recomp";

    const recomputed = computeNutrition(updated, gender, age, height_cm, goal);
    setNutrition(recomputed);
  };

  const currentClientName = clients.find((c) => c.id === targetClient)?.name;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/70"
        role="button"
        tabIndex={-1}
        onClick={onClose}
        onKeyDown={(e) =>
          (e.key === "Escape" || e.key === "Enter") && onClose()
        }
        aria-label="Đóng khi chạm ra ngoài"
      />
      <div className="modal-content relative z-10 max-w-[720px] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              id="scan-modal-title"
              className="text-[18px] font-semibold text-[var(--color-text-primary)]"
            >
              Rà soát bản ghi InBody
            </h3>
            <p className="text-[12px] text-[var(--color-text-muted)]">
              {client
                ? `Dữ liệu minh họa cho ${client.name}`
                : "Chọn học viên, rà soát số liệu rồi mới xác nhận"}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="p-1.5 hover:bg-[var(--color-canvas)] rounded-[var(--radius-base)] transition-colors border-none bg-transparent cursor-pointer"
          >
            <X size={18} className="text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Client Selector (if not opened for specific client) */}
        {!client && (
          <div className="mb-4">
            <label
              htmlFor="target-client-select"
              className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1.5 cursor-pointer"
            >
              Gán cho học viên
            </label>
            <select
              id="target-client-select"
              name="targetClient"
              className="input cursor-pointer font-medium"
              value={targetClient}
              onChange={(e) => setTargetClient(e.target.value)}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({getGoalLabel(c.profile.goal)} •{" "}
                  {c.sessions_remaining}/{c.sessions_total} buổi)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Upload Zone & Fixtures */}
        <div className="mb-4">
          <label
            htmlFor="inbody-file-input"
            className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-2 cursor-pointer"
          >
            Chọn ảnh để xem luồng mẫu hoặc chọn dữ liệu có sẵn
          </label>

          <input
            id="inbody-file-input"
            name="inbodyFile"
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf"
            className="hidden"
          />
          <label
            htmlFor="inbody-file-input"
            className="w-full border-2 border-dashed border-[var(--color-border-strong)] hover:border-[var(--color-brand)] bg-[var(--color-canvas)] rounded-[var(--radius-base)] p-3 text-center cursor-pointer transition-colors mb-3 block"
          >
            <div className="flex items-center justify-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
              <Upload size={16} className="text-[var(--color-brand)]" />
              {uploadedFileName ? (
                <span className="font-medium text-[var(--color-brand)]">
                  {uploadedFileName}
                </span>
              ) : (
                <span>Chọn ảnh phiếu để xem luồng giao diện</span>
              )}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              Tệp không được tải lên hoặc phân tích; kết quả bên dưới là dữ liệu
              mẫu
            </p>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {scanFixtures.map((fixture, idx) => (
              <button
                key={fixture.fixture_name}
                type="button"
                onClick={() => handleSelectFixture(idx)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-base)] border text-left transition-all cursor-pointer bg-[var(--color-surface-muted)] text-[12px]",
                  selectedFixture === idx && !uploadedFileName
                    ? "border-[var(--color-brand)] bg-[var(--color-brand-light)] font-semibold"
                    : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]",
                )}
              >
                {idx < 2 ? (
                  <FileText
                    size={14}
                    className="text-[var(--color-brand)] shrink-0"
                  />
                ) : (
                  <Smartphone
                    size={14}
                    className="text-[var(--color-brand)] shrink-0"
                  />
                )}
                <span className="truncate">{fixture.fixture_name.replace(/\s+\u2014\s+/, ", ")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Processing Indicator */}
        {processing && (
          <div className="py-8 text-center bg-[var(--color-canvas)] rounded-[var(--radius-base)] border border-[var(--color-border-default)] mb-4">
            <Loader2
              size={24}
              className="text-[var(--color-brand)] animate-spin mx-auto mb-2"
            />
            <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
              Đang nạp kết quả mô phỏng…
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              Bản mẫu dùng dữ liệu có sẵn, không chạy OCR trực tiếp
            </p>
          </div>
        )}

        {/* Results */}
        {biometrics && nutrition && !processing && (
          <>
            <div className="flex items-center justify-between bg-[var(--color-success-light)] border border-[var(--color-border-default)] rounded-[var(--radius-base)] px-3 py-2 mb-4">
              <div className="flex items-center gap-2 text-[12px] text-[var(--color-success)] font-medium">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Dữ liệu minh họa đã sẵn sàng để kiểm tra</span>
              </div>
              <span className="text-[11px] text-[var(--color-success)] font-mono">
                {currentClientName ? `Học viên: ${currentClientName}` : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <h4 className="section-caption mb-2 flex items-center gap-1.5">
                  <Edit3 size={11} /> Chỉ số có thể chỉnh sửa
                </h4>
                <div className="space-y-1.5">
                  {[
                    { label: "Cân nặng", key: "weight_kg" as const, unit: "kg" },
                    {
                      label: "Khối lượng cơ xương",
                      key: "skeletal_muscle_mass_kg" as const,
                      unit: "kg",
                    },
                    {
                      label: "Khối lượng mỡ",
                      key: "body_fat_mass_kg" as const,
                      unit: "kg",
                    },
                    {
                      label: "Tỷ lệ mỡ cơ thể",
                      key: "percent_body_fat" as const,
                      unit: "%",
                    },
                  ].map(({ label, key, unit }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-[var(--color-canvas)] rounded-[var(--radius-sm)] border border-[var(--color-border-default)]"
                    >
                      <label
                        htmlFor={`scan-metric-${key}`}
                        className="text-[12px] text-[var(--color-text-secondary)] cursor-pointer"
                      >
                        {label}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          id={`scan-metric-${key}`}
                          name={`metric_${key}`}
                          aria-label={label}
                          type="number"
                          value={biometrics[key] ?? ""}
                          onChange={(e) =>
                            handleBiometricChange(
                              key,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-[64px] h-[26px] text-right font-mono text-[13px] font-semibold bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-1.5 focus:border-[var(--color-brand)] outline-none text-[var(--color-text-primary)]"
                          step="0.1"
                        />
                        <span className="text-[10px] text-[var(--color-text-muted)] w-[20px]">
                          {unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="section-caption mb-2">
                  Mục tiêu dinh dưỡng tham khảo
                </h4>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "Năng lượng mỗi ngày",
                      value: nutrition.target_calories_kcal,
                      unit: "kcal",
                      bold: true,
                    },
                    {
                      label: "Chuyển hóa cơ bản",
                      value: nutrition.bmr_kcal,
                      unit: "kcal",
                    },
                    {
                      label: "Mục tiêu protein",
                      value: nutrition.protein_grams,
                      unit: "g",
                    },
                    {
                      label: "Mục tiêu tinh bột",
                      value: nutrition.carbohydrate_grams,
                      unit: "g",
                    },
                    {
                      label: "Mục tiêu chất béo",
                      value: nutrition.fat_grams,
                      unit: "g",
                    },
                  ].map(({ label, value, unit, bold }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-[var(--color-canvas)] rounded-[var(--radius-sm)] border border-[var(--color-border-default)]"
                    >
                      <span className="text-[12px] text-[var(--color-text-secondary)]">
                        {label}
                      </span>
                      <span
                        className={`font-mono text-[13px] ${
                          bold
                            ? "font-bold text-[var(--color-brand)] text-[14px]"
                            : "font-semibold text-[var(--color-text-primary)]"
                        }`}
                      >
                        {value.toLocaleString()}{" "}
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {unit}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {saved ? (
              <div className="flex items-center justify-center gap-2 py-3 bg-[var(--color-success-light)] rounded-[var(--radius-base)] border border-[var(--color-border-default)]">
                <Check size={16} className="text-[var(--color-success)]" />
                <span className="text-[13px] font-medium text-[var(--color-success)]">
                  Đã lưu vào hồ sơ mẫu của {currentClientName || "học viên"}.
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary w-1/3"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn-primary flex-1"
                  onClick={handleSave}
                  disabled={!targetClient}
                >
                  <CheckCircle2 size={16} />
                  Xác nhận vào hồ sơ mẫu
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
