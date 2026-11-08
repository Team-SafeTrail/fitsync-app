import test from 'node:test';
import assert from 'node:assert/strict';
import { selectScenes, validateTake, completeGate, validateWorkflowPreview } from './render.mjs';
import { scenes } from './common.mjs';

test('complete export rejects missing scenes before touching production or encoding', async () => {
  await assert.rejects(completeGate({ local: false }, []), /all nine scenes/);
});
test('complete export rejects local footage even with nine scene names', async () => {
  await assert.rejects(completeGate({ local: true }, scenes.map(s => ({ ...s, localDraft: true }))), /production origin/);
});
test('complete export rejects admin-only excerpt as proof of full role workflow', async () => {
  const manifests = scenes.map(s => ({ ...s, localDraft: false }));
  manifests[7].partial = true;
  await assert.rejects(completeGate({ local: false }, manifests), /partial scenes/);
});
test('scene selection preserves primary script order and rejects duplicates', () => {
  assert.deepEqual(selectScenes('02-team,01-landing').map(s => s.id), ['01-landing', '02-team']);
  assert.throws(() => selectScenes('01-landing,01-landing'), /duplicate/);
});
test('take validation rejects changed provenance and unsafe browser evidence', () => {
  const manifest = { sourceRevision: 'rev', origin: 'https://example.test' };
  const take = { ...manifest, seconds: 25, trimStart: 1, syntheticAttested: true, browserErrors: 0, unexpectedPopups: 0 };
  assert.throws(() => validateTake({ ...take, origin: 'https://other.test' }, { seconds: 25 }, manifest), /provenance/);
  assert.throws(() => validateTake({ ...take, browserErrors: 1 }, { seconds: 25 }, manifest), /browser/);
  assert.throws(() => validateTake({ ...take, trimStart: NaN }, { seconds: 25 }, manifest), /timing/);
});
test('workflow preview permits only declared honest variants and the target duration', () => {
  const manifests = scenes.map(s => ({ ...s, partial: false }));
  manifests[6] = { ...manifests[6], seconds: 25, partial: true, variant: 'activity-review', missingActions: ['aged warning fixture'] };
  manifests[7] = { ...manifests[7], seconds: 15, partial: true, variant: 'ordinary-role-protection', missingActions: ['authenticated admin portal'] };
  assert.doesNotThrow(() => validateWorkflowPreview(manifests));
  assert.throws(() => validateWorkflowPreview(manifests.slice(0, 3)), /all nine sections/);
  const fabricated = manifests.map(m => ({ ...m }));
  fabricated[7].variant = 'mock-admin';
  assert.throws(() => validateWorkflowPreview(fabricated), /Unsupported partial/);
});
test('recovered input footage stays in preview and cannot satisfy final browser checks', () => {
  const manifest = { sourceRevision: 'rev', origin: 'https://example.test' };
  const take = { ...manifest, seconds: 12, trimStart: 1, syntheticAttested: true, browserErrors: null, unexpectedPopups: null, recoveryVerification: { reason: 'automation_timeout_after_submit', serverPersistenceConfirmed: true, segmentFramesReviewed: true, fullDecodePassed: true } };
  assert.throws(() => validateTake(take, { seconds: 12 }, manifest), /browser checks/);
  assert.doesNotThrow(() => validateTake(take, { seconds: 12 }, manifest, { allowRecovered: true }));
});
