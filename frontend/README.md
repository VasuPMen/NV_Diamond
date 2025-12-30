# NV Diamond Frontend

A highly optimized React frontend for the NV Diamond Management System.

## Features

- **Left Sidebar Navigation**: Purchase and Master sections
- **Purchase Management**: Full CRUD operations for purchases
- **Master Data Management**: Manage all master data entities (Color, Stone, Shape, Cut, Purity, Polish, Symmetry, Fluorescence, Table, Tension, Height, Length, Width)
- **Performance Optimized**: Uses React.memo, useMemo, and useCallback for minimal re-renders
- **Tailwind CSS**: Modern, responsive UI design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Backend

Make sure the backend is running on http://localhost:5000. The frontend is configured to proxy API requests to the backend.

## Build

To build for production:
```bash
npm run build
```

