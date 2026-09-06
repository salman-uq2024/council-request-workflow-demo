# Quality and support walkthrough

## Reproduce

```bash
npm ci
npm test
npm run build
npm run dev
```

Local verification on 5 September 2026: **8 regression tests passed**, TypeScript check and Vite build passed. CI runs the tests and build on Node.js 22.

## Requirements and evidence

| Requirement | Automated evidence |
| --- | --- |
| Incomplete requests show useful validation errors | Form normalisation and invalid-email/title/description test |
| A submitted request cannot jump directly to completion | Invalid transition test calls the domain function directly |
| Approval and delivery retain the previous history | Approval → start → complete → reopen audit test |
| A stale/unknown ID cannot alter another request | Unknown-ID test |
| Browser storage failures do not prevent startup | Blocked storage, malformed JSON and invalid saved-record tests |
| Failed persistence is communicated | Storage quota failure returns a warning |

## Defect: startup failed with blocked storage

Previously, `localStorage.getItem` ran outside the error handler. A browser policy throwing `SecurityError` could prevent the app from rendering. The read now occurs inside the recovery boundary; the app loads fresh sample records and returns a warning. The regression test deliberately throws from the storage getter.

## Defect: transitions enforced only by buttons

The UI offered valid actions, but the domain function would accept a direct `complete` action on a newly submitted request. The function now checks the transition contract before altering the status or adding history. Invalid actions leave the record unchanged.

## Manual acceptance walkthrough

1. Submit a complete synthetic request and confirm it appears once in the dashboard.
2. Approve it, start work, complete it and inspect its audit history.
3. Refresh and verify persistence when browser storage is available.
4. Try an invalid email and verify the form explains what to correct.
5. Test a narrow screen and keyboard navigation through the form and review controls.

These manual scenarios are not claimed as automated browser coverage.

## Support triage

Record the browser/version, selected view, synthetic request ID, expected state and actual state. Determine whether the issue is input validation, transition logic, rendering or browser persistence. Reproduce with sample records before changing a user's stored data. Resetting demo data discards local changes; preserve anything needed first.

The app has no server, user authentication, shared database or cross-user concurrency control. It demonstrates workflow behaviour and recoverability, not production access control.
