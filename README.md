# Council Request Workflow Demo

A portfolio-ready TypeScript project that demonstrates a realistic internal service request workflow for an Automation and Application Specialist style role. The app is intentionally lightweight, business-oriented, and easy to run locally without external dependencies.

## Project Summary

This demo models a council-style internal workflow where business users submit service requests and an ICT or applications team triages, approves, delivers, and audits them. It is designed to show practical skills that align with application support, workflow design, service operations, and documentation.

Included features:

- Request submission form for new internal requests
- Status dashboard with queue visibility and workload summaries
- Admin review screen for approval and workflow decisions
- Audit/history view showing request-level and cross-request activity
- Seeded mock data with local browser persistence

## Why This Works As A Portfolio Piece

This repository is structured to present well in a resume, portfolio, or interview because it demonstrates:

- TypeScript implementation with clear domain modelling
- Sensible UI and information design for internal business users
- Workflow thinking across intake, review, delivery, and auditability
- Lightweight architecture choices appropriate for a local demo or proof of concept
- Documentation that explains design intent and tradeoffs

## Stack

- React 18
- TypeScript
- Vite
- CSS
- Local JSON seed data plus `localStorage` persistence

No backend, cloud account, or external database is required.

## Quick Start

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

### Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

### Verification

```bash
npm run check
npm run build
```

## Demo Workflow

1. Open the `Request Submission` view and create a new service request.
2. Review the new item in the `Status Dashboard`.
3. Move to `Admin Review` to approve, reject, or progress the request.
4. Open `Audit History` to inspect the full timeline of actions.
5. Use `Reset demo data` to restore the seeded examples.

## Repository Structure

```text
.
├── architecture.md
├── screenshots/
│   └── README.md
├── src/
│   ├── components/
│   ├── data/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
└── vite.config.ts
```

## Documentation

- Architecture overview: [architecture.md](./architecture.md)
- Screenshot guidance: [screenshots/README.md](./screenshots/README.md)

## Suggested Resume Framing

You could describe this project as:

> Built a TypeScript-based internal service request workflow demo that models request intake, approval, status tracking, and audit history for a council-style business environment using a lightweight local-first architecture.

## Future Enhancements

- Add role-based views for requester, analyst, and administrator personas
- Replace `localStorage` with a small API or SQLite-backed service layer
- Add filtering, SLA indicators, and exportable audit reports
- Add automated tests around request state transitions

