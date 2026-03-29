# Architecture

## Overview

This project is a local-first internal workflow demo built to showcase the sort of business application thinking expected in an Automation and Application Specialist role. It focuses on a narrow but realistic use case: receiving internal service requests, tracking their progress, supporting approval decisions, and maintaining an auditable history.

## Design Goals

- Keep the stack lightweight and simple to run locally
- Model a realistic business process without overengineering
- Demonstrate clear separation between UI, workflow logic, and data
- Make the repository easy to review in a hiring context

## Technology Choices

### Frontend

- React with TypeScript for strongly typed UI development
- Vite for a fast local developer experience and minimal configuration
- Plain CSS for a low-complexity styling layer

### Data Layer

- Sample request records stored in `src/data/sample-request-records.json`
- Workflow and persistence helpers in `src/data/workflow.ts`
- Shared request options and validation helpers in `src/data/requestOptions.ts` and `src/data/requestValidation.ts`
- Browser `localStorage` used as the runtime persistence mechanism

This keeps the demo self-contained while still showing a clear path toward a more formal service or database layer.

## Application Structure

### Entry Point

- `src/main.tsx` mounts the app and loads the shared stylesheet

### Shell

- `src/App.tsx` owns top-level state, view switching, message banners, and orchestration between screens

### UI Components

- `src/components/RequestForm.tsx` handles request intake
- `src/components/StatusDashboard.tsx` presents operational metrics and request listings
- `src/components/AdminReviewPanel.tsx` supports workflow actions such as review, approval, rejection, and completion
- `src/components/AuditHistoryView.tsx` presents request-specific history and recent global activity
- `src/components/ViewTabs.tsx` provides the main navigation between views

### Domain Types

- `src/types.ts` defines the request, audit, and workflow-related types used throughout the app

## Workflow Model

The request lifecycle is intentionally simple:

1. `Submitted`
2. `In Review`
3. `Approved`
4. `In Progress`
5. `Completed`

Alternative path:

1. `Submitted`
2. `In Review`
3. `Rejected`
4. `Reopened` back to `In Review`

Each admin action writes a new audit entry with:

- timestamp
- actor
- action
- note

This allows the demo to show both operational state and governance history.

## Data Flow

1. The app loads bundled sample request data on first run.
2. The initial dataset is cloned into browser storage.
3. New submissions and admin actions update in-memory React state.
4. A persistence effect writes the current request list back to `localStorage`.
5. The audit view derives timelines directly from the stored request history.

If the saved browser data is malformed, the app falls back to the bundled sample records and displays a simple recovery message instead of failing silently.

## Why This Architecture Fits The Brief

- Easy to run locally for an interview or portfolio reviewer
- Typed and structured enough to reflect professional implementation habits
- Demonstrates workflow design, auditability, and practical business application thinking
- Small enough to understand quickly, but complete enough to feel credible

## Natural Next Step

If this were expanded beyond a portfolio demo, the next step would be extracting the workflow functions into a small API-backed service and introducing user roles, search/filtering, and automated tests around transition rules.
