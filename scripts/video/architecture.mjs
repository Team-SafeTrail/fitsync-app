// 1080p safe framing: the complete original diagram remains on screen.
// Optional readable details appear inside a separate inset, never full bleed.
export const architectureLayout = {
  frame: { width: 1920, height: 1080 },
  overview: { x: 120, y: 160, width: 576, height: 840 },
  detail: { x: 800, y: 240, width: 1024, height: 604 },
};

export function architectureFilter({ width, height, statusFilter }) {
  const relativeCrop = (x, y, w, h) => [
    Math.floor(width * w / 2) * 2,
    Math.floor(height * h / 2) * 2,
    Math.floor(width * x / 2) * 2,
    Math.floor(height * y / 2) * 2,
  ];
  // Regions from the supplied Toàn diagram, expressed proportionally so the
  // original image stays untouched and the same layout supports larger exports.
  const crops = [
    relativeCrop(0.285, 0, 0.712, 0.300),
    relativeCrop(0, 0.535, 0.515, 0.272),
    relativeCrop(0.535, 0.500, 0.463, 0.325),
    relativeCrop(0.355, 0.780, 0.643, 0.219),
  ];
  const filters = [
    '[0:v]split=5[overview][c0][c1][c2][c3]',
    '[overview]scale=576:840:force_original_aspect_ratio=decrease,setsar=1,pad=1920:1080:120:160:color=0x0E0E12[base]',
  ];
  let previous = 'base';
  for (const [i, crop] of crops.entries()) {
    const [w, h, x, y] = crop;
    filters.push(`[c${i}]crop=${w}:${h}:${x}:${y},scale=1000:580:force_original_aspect_ratio=decrease,setsar=1,pad=1024:604:(ow-iw)/2:(oh-ih)/2:color=white[d${i}]`);
    const next = `step${i}`;
    filters.push(`[${previous}][d${i}]overlay=800:240:enable='gte(t,${8 + i * 5})*lt(t,${13 + i * 5})'[${next}]`);
    previous = next;
  }
  const text = (file, size, x, y, color = '0xECEAE6', when) => `drawtext=fontfile=font.ttf:textfile=${file}:fontsize=${size}:fontcolor=${color}:x=${x}:y=${y}${when ? `:enable='${when}'` : ''}`;
  const typography = [
    text('arch-title.txt', 38, 120, 62),
    text('arch-subtitle.txt', 22, 120, 112, '0x9A968F'),
    text('arch-intro.txt', 30, 800, 290, '0xECEAE6', 'lt(t,8)'),
    text('arch-intro-note.txt', 23, 800, 350, '0x9A968F', 'lt(t,8)'),
    ...crops.map((_, i) => text(`arch-detail-${i}.txt`, 24, 800, 190, '0xF5A623', `gte(t,${8 + i * 5})*lt(t,${13 + i * 5})`)),
    text('arch-security.txt', 24, 800, 900),
    text('arch-storage.txt', 22, 800, 944, '0x9A968F'),
    text('arch-server.txt', 22, 800, 980, '0x9A968F'),
    statusFilter,
    'format=yuv420p',
  ];
  filters.push(`[${previous}]${typography.join(',')}[out]`);
  return filters.join(';');
}

export const architectureText = {
  'arch-title.txt': 'Kiến trúc dữ liệu FitSync',
  'arch-subtitle.txt': '8 bảng cốt lõi · Sơ đồ gốc và các vùng chi tiết',
  'arch-intro.txt': 'Một quy trình, dữ liệu liên kết',
  'arch-intro-note.txt': 'Danh tính → Huấn luyện → Check-in → InBody',
  'arch-detail-0.txt': 'Chi tiết · Danh tính và hồ sơ PT',
  'arch-detail-1.txt': 'Chi tiết · Lời mời và check-in',
  'arch-detail-2.txt': 'Chi tiết · Chỉ số InBody đã xác minh',
  'arch-detail-3.txt': 'Chi tiết · Meal log và OCR attempt',
  'arch-security.txt': 'RLS · Quyền truy cập theo quan hệ PT–học viên',
  'arch-storage.txt': 'Private storage: meal-media · inbody-media',
  'arch-server.txt': 'Service role chỉ dùng phía server · theo migrations',
};
