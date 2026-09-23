# Senriva Asset Cleanup Analyzer

Dependency-aware HubSpot asset management demo for identifying orphaned, stale, missing, duplicated, and archived HubFS and Design Manager assets before cleanup.

## Features

- HubFS asset inventory
- Design Manager template and module inventory
- Reference counts
- Orphaned asset detection
- Stale asset detection
- Missing dependency detection
- Archive awareness
- Duplicate grouping
- Cleanup candidate classification
- Estimated recoverable storage
- Referenced-by inspection
- Search and filtering
- Non-destructive cleanup preview

## Cleanup Philosophy

An old file is not automatically safe to remove.

Cleanup decisions should consider:

- active references
- dependency usage
- archive coverage
- missing live assets
- duplicate or legacy status
- environment context

## Archive vs. Live Usage

The analyzer distinguishes between:

- assets preserved in archive history
- assets currently referenced by live portal content
- orphaned assets with no active dependencies
- missing assets that are still referenced
- cleanup candidates that are both unreferenced and archived

This allows cleanup recommendations to be based on actual portal usage rather than age alone.

## Technology

- React
- TypeScript
- Vite
- Node.js
- Express
- REST API

## API

GET /api/health

Returns API health.

GET /api/assets

Returns fictional HubFS and Design Manager asset inventory data.

GET /api/summary

Returns asset-analysis metrics including total assets, storage, orphaned items, stale items, missing dependencies, duplicate groups, and potential recoverable storage.

## Local Development

Backend:

    Set-Location "D:\Projects\senriva-asset-analyzer\server"
    npm install
    npm run dev

Frontend:

    Set-Location "D:\Projects\senriva-asset-analyzer\client"
    npm install
    npm run dev

Open:

http://localhost:5173

## Safety

This public demo is analysis-only.

It does not:

- delete HubSpot assets
- overwrite files
- publish content
- modify Design Manager artifacts
- perform destructive cleanup actions

A production implementation should keep destructive actions previewed, explicitly gated, auditable, and disabled by default.

## Demo Data

This repository uses fictional demonstration data and contains no proprietary employer code, credentials, customer data, or production HubSpot content.

## Senriva

This project is part of an early Senriva portal-intelligence suite covering:

- asset management
- dependency analysis
- content auditing
- backup and recovery
- migration readiness
- cross-account reconstruction

## Author

Patrick Brady
