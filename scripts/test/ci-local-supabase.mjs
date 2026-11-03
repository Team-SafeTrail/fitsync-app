import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { localTestEnvironment } from "./local-environment.mjs";

if (process.env.GITHUB_ACTIONS !== "true" || !process.env.GITHUB_ENV) {
  throw new Error("This bootstrap is for an ephemeral GitHub Actions runner only.");
}
function cli(args) {
  const result = spawnSync(process.execPath, ["node_modules/supabase/dist/supabase.js", ...args], {
    encoding:"utf8", maxBuffer:32 * 1024 * 1024, timeout:12 * 60 * 1000,
  });
  if (result.status !== 0) {
    const diagnostic = `${result.stderr ?? ""}\n${result.stdout ?? ""}`
      .replace(/eyJ[A-Za-z0-9_.-]+/g, "[REDACTED]")
      .replace(/(?:sb_secret_|sb_publishable_|sbp_)[A-Za-z0-9_-]+/g, "[REDACTED]")
      .replace(/postgres(?:ql)?:\/\/[^\s]+/g, "[LOCAL_DATABASE_URI]").slice(-6000);
    console.error(diagnostic);
    throw new Error(`Local stack command failed (${result.status ?? "timeout"}).`);
  }
  return result.stdout;
}
// Leave auth, REST, gateway, storage and mailpit available for real synthetic flows.
cli(["start", "--exclude", "studio,imgproxy,postgres-meta,edge-runtime,logflare,vector,supavisor,realtime"]);
const status = JSON.parse(cli(["status", "-o", "json"]));
const env = localTestEnvironment(status);
// Mask every credential before making it available to later runner steps.
for (const value of [env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, env.SUPABASE_SERVICE_ROLE_KEY]) {
  console.log(`::add-mask::${value}`);
}
for (const [key,value] of Object.entries(env)) appendFileSync(process.env.GITHUB_ENV, `${key}=${value}\n`);
console.log("Isolated loopback test stack ready; local credentials masked.");
