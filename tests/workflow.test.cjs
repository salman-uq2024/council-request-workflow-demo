const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { loadRequests, saveRequests, applyAdminAction, buildRequest } = require('../.test-build/data/workflow.js');
const { normalizeRequestFormValues, validateRequestForm } = require('../.test-build/data/requestValidation.js');
const samples = require('../.test-build/data/sample-request-records.json');
const values = { title: '  Repair   printer ', description: 'Please restore the office printer service.', department: ' ICT ', location: 'Office', requesterName: 'Demo User', requesterEmail: ' DEMO@EXAMPLE.COM ', category: 'Application Support', priority: 'High' };
afterEach(() => { delete global.window; });

test('blocked browser storage recovers to independent sample records', () => {
  global.window = { get localStorage() { throw new Error('SecurityError'); } };
  const result = loadRequests();
  assert.ok(result.warningMessage);
  assert.deepEqual(result.requests, samples);
  result.requests[0].history.length = 0;
  assert.ok(loadRequests().requests[0].history.length > 0);
});

test('malformed saved JSON and invalid record structures recover with a warning', () => {
  for (const saved of ['{broken', '{}', '[{"id":"bad"}]']) {
    global.window = { localStorage: { getItem: () => saved } };
    assert.ok(loadRequests().warningMessage);
    assert.deepEqual(loadRequests().requests, samples);
  }
});

test('valid saved data round trips; failed writes return a visible warning', () => {
  let stored;
  global.window = { localStorage: { getItem: () => stored, setItem: (_, value) => { stored = value; } } };
  assert.equal(saveRequests(samples), null);
  assert.deepEqual(loadRequests().requests, samples);
  global.window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.match(saveRequests(samples), /could not be saved/);
});

test('submitted requests cannot skip approval and finish immediately', () => {
  const request = buildRequest(samples, normalizeRequestFormValues(values));
  const before = structuredClone(request);
  const result = applyAdminAction([request], request.id, 'complete', '', 'Reviewer');
  assert.deepEqual(result, [before]);
});

test('approval, start and completion preserve an immutable audit history', () => {
  const request = buildRequest(samples, normalizeRequestFormValues(values));
  let records = [request];
  for (const [action, status] of [['approve','Approved'],['start','In Progress'],['complete','Completed'],['reopen','In Review']]) {
    const before = structuredClone(records);
    records = applyAdminAction(records, request.id, action, '  checked  ', 'Reviewer');
    assert.equal(records[0].status, status);
    assert.equal(records[0].history.length, before[0].history.length + 1);
    assert.deepEqual(records[0].history.slice(1), before[0].history);
    assert.equal(records[0].history[0].note, 'checked');
    assert.equal(records[0].history[0].actor, 'Reviewer');
  }
  assert.equal(request.status, 'Submitted');
  assert.equal(new Set(records[0].history.map(x => x.id)).size, records[0].history.length);
});

test('unknown request IDs leave records untouched', () => {
  assert.deepEqual(applyAdminAction(samples, 'missing', 'approve', '', 'Reviewer'), samples);
});

test('normalisation and validation reject incomplete support requests', () => {
  const normal = normalizeRequestFormValues(values);
  assert.equal(normal.title, 'Repair printer');
  assert.equal(normal.requesterEmail, 'demo@example.com');
  assert.deepEqual(validateRequestForm(normal), {});
  const errors = validateRequestForm({ ...normal, title: 'short', description: 'too short', requesterEmail: 'invalid' });
  assert.ok(errors.title && errors.description && errors.requesterEmail);
});

test('new requests use unique identifiers and start with a submission audit record', () => {
  const first = buildRequest(samples, normalizeRequestFormValues(values));
  const second = buildRequest([...samples, first], normalizeRequestFormValues(values));
  assert.notEqual(first.id, second.id);
  assert.equal(first.status, 'Submitted');
  assert.equal(first.history[0].actor, 'Demo User');
  assert.ok(new Date(first.targetDate) > new Date(first.submittedAt));
});
