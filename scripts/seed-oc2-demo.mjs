import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";

const requireFromWebWorkspace = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { createClient } = requireFromWebWorkspace("@supabase/supabase-js");

const applyChanges = process.argv.includes("--apply");
const ptCount = 4;
const traineeCount = 12;
const inBodyCount = 15;
const mealCount = 8;

const pad = (value) => String(value).padStart(2, "0");
const uuidFor = (prefix, value) =>
  `${prefix}0000000-0000-4000-8000-${String(value).padStart(12, "0")}`;
const isoDate = (daysAgo = 0) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};
const randomPassword = () => `${randomBytes(18).toString("base64url")}aA1!`;

const plan = {
  mode: applyChanges ? "apply" : "plan-only",
  syntheticOnly: true,
  users: { admin: 1, pts: ptCount, trainees: traineeCount },
  records: { inBody: inBodyCount, checkinsWithMeals: mealCount },
  warnings: 2,
  payments: {
    seeded: 0,
    reason: "The accepted schema has no payment_records table; do not fabricate reconciled revenue.",
  },
};

if (!applyChanges) {
  console.log(JSON.stringify(plan, null, 2));
  console.log("Plan only. Use npm run seed:oc2:apply after configuring approved Cloud secrets.");
  process.exit(0);
}

if (process.env.OC2_SEED_CONFIRM !== "synthetic-only") {
  throw new Error("Set OC2_SEED_CONFIRM=synthetic-only before applying the OC2 seed.");
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.OC2_ADMIN_EMAIL ?? "oc2.admin@example.test";
const adminPassword = process.env.OC2_ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are required.");
}
if (!adminPassword || adminPassword.length < 12) {
  throw new Error("OC2_ADMIN_PASSWORD must be supplied by the approved secret channel and contain at least 12 characters.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const listResult = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listResult.error) throw listResult.error;
const usersByEmail = new Map(
  listResult.data.users
    .filter((user) => user.email)
    .map((user) => [user.email.toLowerCase(), user]),
);

async function ensureUser({ email, password, displayName, role }) {
  const normalizedEmail = email.toLowerCase();
  const existing = usersByEmail.get(normalizedEmail);
  if (existing) {
    const update = await supabase.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      user_metadata: { display_name: displayName, role, synthetic: true },
    });
    if (update.error) throw update.error;
    return update.data.user;
  }

  const created = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName, role, synthetic: true },
  });
  if (created.error) throw created.error;
  usersByEmail.set(normalizedEmail, created.data.user);
  return created.data.user;
}

const adminUser = await ensureUser({
  email: adminEmail,
  password: adminPassword,
  displayName: "Quản trị viên Demo OC2",
  role: "admin",
});

const ptUsers = [];
for (let index = 1; index <= ptCount; index += 1) {
  ptUsers.push(
    await ensureUser({
      email: `oc2.pt${pad(index)}@example.test`,
      password: randomPassword(),
      displayName: `PT Mẫu ${pad(index)}`,
      role: "pt",
    }),
  );
}

const traineeUsers = [];
for (let index = 1; index <= traineeCount; index += 1) {
  traineeUsers.push(
    await ensureUser({
      email: `oc2.trainee${pad(index)}@example.test`,
      password: randomPassword(),
      displayName: `Học viên Mẫu ${pad(index)}`,
      role: "trainee",
    }),
  );
}

const profileRows = [
  { id: adminUser.id, role: "admin", display_name: "Quản trị viên Demo OC2", phone: null },
  ...ptUsers.map((user, index) => ({
    id: user.id,
    role: "pt",
    display_name: `PT Mẫu ${pad(index + 1)}`,
    phone: null,
  })),
  ...traineeUsers.map((user, index) => ({
    id: user.id,
    role: "trainee",
    display_name: `Học viên Mẫu ${pad(index + 1)}`,
    phone: null,
  })),
];

const profilesUpsert = await supabase.from("profiles").upsert(profileRows, { onConflict: "id" });
if (profilesUpsert.error) throw profilesUpsert.error;

const adminPtCleanup = await supabase.from("pt_profiles").delete().eq("id", adminUser.id);
if (adminPtCleanup.error) throw adminPtCleanup.error;

const ptRows = ptUsers.map((user, index) => ({
  id: user.id,
  gym_affiliation: `Phòng tập mô phỏng ${String.fromCharCode(65 + index)}`,
  subscription_plan: index < 3 ? "pro" : "free",
}));
const ptUpsert = await supabase.from("pt_profiles").upsert(ptRows, { onConflict: "id" });
if (ptUpsert.error) throw ptUpsert.error;

const traineeRows = traineeUsers.map((user, index) => ({
  id: uuidFor("d", index + 1),
  profile_id: user.id,
  assigned_pt_id: ptUsers[index % ptUsers.length].id,
  display_name: `Học viên Mẫu ${pad(index + 1)}`,
  phone: null,
  primary_goal: ["fat_loss", "muscle_gain", "recomp"][index % 3],
  status: index >= traineeCount - 2 ? "warning" : "active",
  total_sessions: 12,
  remaining_sessions: Math.max(1, 12 - index),
  engagement_started_on: isoDate(14),
  last_checkin_date: index >= traineeCount - 2 ? isoDate(5) : isoDate(index % 2),
}));
const traineeUpsert = await supabase.from("trainee_profiles").upsert(traineeRows, { onConflict: "id" });
if (traineeUpsert.error) throw traineeUpsert.error;

const inBodyRows = Array.from({ length: inBodyCount }, (_, index) => {
  const trainee = traineeRows[index % traineeRows.length];
  const weight = 58 + index;
  const percentFat = 18 + (index % 5);
  const fatMass = Number(((weight * percentFat) / 100).toFixed(2));
  return {
    id: uuidFor("b", index + 1),
    trainee_id: trainee.id,
    pt_id: trainee.assigned_pt_id,
    weight_kg: weight,
    skeletal_muscle_mass_kg: Number((weight * 0.4).toFixed(2)),
    body_fat_mass_kg: fatMass,
    percent_body_fat: percentFat,
    total_body_water_liters: Number((weight * 0.55).toFixed(2)),
    source: "manual",
    is_manually_edited: false,
    verified_by: trainee.assigned_pt_id,
    recorded_at: new Date(Date.now() - index * 86400000).toISOString(),
  };
});
const inBodyUpsert = await supabase.from("inbody_records").upsert(inBodyRows, { onConflict: "id" });
if (inBodyUpsert.error) throw inBodyUpsert.error;

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);
const checkinRows = [];
const mealRows = [];
for (let index = 0; index < mealCount; index += 1) {
  const trainee = traineeRows[index];
  const checkinId = uuidFor("c", index + 1);
  const mealId = uuidFor("e", index + 1);
  const objectPath = `${trainee.id}/oc2-demo-${pad(index + 1)}.png`;
  const upload = await supabase.storage.from("meal-media").upload(objectPath, onePixelPng, {
    contentType: "image/png",
    upsert: true,
  });
  if (upload.error) throw upload.error;
  checkinRows.push({
    id: checkinId,
    trainee_id: trainee.id,
    local_checkin_date: isoDate(index % 2),
    note: "Nhật ký synthetic phục vụ kiểm thử Outcome 2.",
  });
  mealRows.push({
    id: mealId,
    checkin_id: checkinId,
    trainee_id: trainee.id,
    private_photo_path: objectPath,
    photo_mime_type: "image/png",
    photo_size_bytes: onePixelPng.byteLength,
  });
}
const checkinUpsert = await supabase.from("checkins").upsert(checkinRows, { onConflict: "id" });
if (checkinUpsert.error) throw checkinUpsert.error;
const mealUpsert = await supabase.from("meal_logs").upsert(mealRows, { onConflict: "id" });
if (mealUpsert.error) throw mealUpsert.error;

const countQueries = await Promise.all([
  supabase.from("pt_profiles").select("id", { count: "exact", head: true }),
  supabase.from("trainee_profiles").select("id", { count: "exact", head: true }),
  supabase.from("inbody_records").select("id", { count: "exact", head: true }),
  supabase.from("meal_logs").select("id", { count: "exact", head: true }),
]);
for (const result of countQueries) if (result.error) throw result.error;

console.log(
  JSON.stringify(
    {
      ...plan,
      applied: true,
      verifiedMinimumCounts: {
        pts: countQueries[0].count,
        trainees: countQueries[1].count,
        inBody: countQueries[2].count,
        meals: countQueries[3].count,
      },
      credentialsPrinted: false,
    },
    null,
    2,
  ),
);
