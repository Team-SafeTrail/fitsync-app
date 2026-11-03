import { test } from "node:test";
import assert from "node:assert/strict";
import { localTestEnvironment } from "./local-environment.mjs";

const fixture = { API_URL: "http://127.0.0.1:54321", ANON_KEY: "synthetic-public", SERVICE_ROLE_KEY: "synthetic-service" };
test("accepts an isolated local stack without changing the source metadata", () => {
  const source = {...fixture};
  const env = localTestEnvironment(source);
  assert.equal(env.NEXT_PUBLIC_SUPABASE_URL, fixture.API_URL);
  assert.equal(env.SUPABASE_SERVICE_ROLE_KEY, "synthetic-service");
  assert.equal(env.FITSYNC_E2E_LOCAL_DB, "true");
  assert.deepEqual(source, fixture);
});
test("rejects cloud, proxy path, userinfo and misleading loopback domains", () => {
  for (const url of ["https://example.supabase.co", "http://127.0.0.1.example.com:54321", "http://user:pass@127.0.0.1:54321", "http://127.0.0.1:54321/proxy", "http://127.0.0.1:54321?target=cloud"]) {
    assert.throws(() => localTestEnvironment({...fixture, API_URL:url}));
  }
});
test("rejects missing keys and newline injection into runner environment", () => {
  assert.throws(() => localTestEnvironment({...fixture, ANON_KEY:undefined}));
  assert.throws(() => localTestEnvironment({...fixture, SERVICE_ROLE_KEY:"value\nEVIL=true"}));
});
test("supports a local publishable key when the CLI supplies it", () => {
  assert.equal(localTestEnvironment({...fixture, PUBLISHABLE_KEY:"synthetic-modern"}).NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, "synthetic-modern");
});
