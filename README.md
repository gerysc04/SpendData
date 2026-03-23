# SpendData

Enterprise expense tracking and visualization platform built as a technical challenge.

## Live Demo

[https://spend-data-gerysc04s-projects.vercel.app/](https://spend-data-gerysc04s-projects.vercel.app/)

## Overview

SpendData allows companies to track, visualize and analyze employee expenses over time. Expenses are assigned to users and categories, and displayed through interactive charts and a filterable data table.

The core concept maps directly to a metrics platform: each expense is a metric with a **value** (amount), a **name** (description), and a **timestamp** (date) — enriched with relational context (user, category) to make the data actionable.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas via Mongoose
- **Charts**: Recharts
- **Notifications**: react-hot-toast
- **CSV Parsing**: PapaParse

## Architecture Decisions

### Next.js as a full-stack framework
Rather than maintaining a separate frontend and backend, Next.js API routes serve as the backend layer. This simplifies the deployment (single Vercel project), keeps the codebase in one repository, and follows a BFF-inspired pattern where the API is purpose-built for this specific frontend.

### MongoDB over SQL
Expense data is naturally document-shaped and schema flexibility is valuable — adding fields like tags, attachments or metadata in the future requires no migrations. MongoDB Atlas also provides a generous free tier ideal for this use case.

### CSS Modules over a component library
CSS Modules were chosen over Tailwind utility classes or a UI library to keep styles explicit, colocated, and easy to reason about during a code review. Each component owns its styles with no global side effects.

### Client-side filtering and sorting
All filtering (by user, category, date range) and sorting happens on the client since the full dataset is fetched on load. For large datasets this would move to the backend with query parameters — the API is already shaped to support this.

## Features

- Post expenses with description, amount, date, user and category
- Line chart showing spending over time — toggle between total, per category, and per user views
- Pie chart showing spending breakdown by category
- Filter expenses by user, category and date range
- Sort expenses by any column
- Edit and delete expenses with confirmation
- Export filtered expenses to CSV
- Import expenses from CSV — users and categories are created automatically if they don't exist (upsert pattern)
- Toast notifications for all actions

## Data Model
```
User        { name, color }
Category    { name, color }
Expense     { description, amount, date, userId, categoryId }
```

## CSV Import Format

Columns must be in this order (header row optional):
```
description, amount, date, user, category
```

Example:
```
Team lunch, 45.50, 2026-01-05, Gerard, Food
Office supplies, 120.00, 2026-01-08, Sarah, Office
```

## Running Locally
```bash
# Clone the repo
git clone https://github.com/gerysc04/SpendData.git
cd SpendData

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your MongoDB URI to .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables
```
MONGODB_URI=your_mongodb_atlas_connection_string
```

## Potential Improvements

- **Authentication**: Add NextAuth.js with OAuth — the data model already supports it since expenses are linked to a userId
- **Pagination**: For large datasets, paginate the expenses table and move filtering to the backend
- **CSV Import queue**: For large CSV files, process imports asynchronously using a job queue (e.g. Bull) to avoid blocking the request
- **Budget limits**: Set spending limits per category and alert when exceeded
- **Real-time updates**: Use Server-Sent Events or WebSockets to push new expenses to all connected clients

