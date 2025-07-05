# Frontend Documentation

This is the documentation for the StockMarket web frontend.

## Overview

The frontend is a single-page application (SPA) built with vanilla TypeScript, Vite, and Bootstrap. It follows a component-based architecture to promote modularity and reusability. The application is designed to be lightweight and performant, relying on a simple, custom-built router for client-side navigation and a set of services for interacting with the backend API.

## Core Technologies

- **TypeScript**: Provides static typing for robust and maintainable code.
- **Vite**: A next-generation frontend tooling system that offers a fast and lean development experience.
- **Bootstrap**: Used for responsive design, theming, and pre-built UI components.
- **Sass**: For more advanced and maintainable CSS.
- **Chart.js**: For rendering interactive charts on the dashboard.

## Key Architectural Concepts

- **Component-Based Architecture**: The UI is broken down into small, independent, and reusable components (e.g., `Navbar`, `TradeForm`, `SummaryCard`). Each component is responsible for its own rendering and logic.
- **Service Layer**: A dedicated layer of services (`stockService`, `authService`) encapsulates all communication with the backend API, separating data fetching and state management from the UI components.
- **Client-Side Routing**: A custom, lightweight router (`router.ts`) handles navigation without full page reloads. It supports protected routes to restrict access to authenticated users.
- **Event-Driven UI Updates**: The application uses a simple event-driven model (e.g., a global `auth-change` event) to notify components of state changes, allowing them to re-render dynamically.

## Data Flow

For a detailed explanation of how the frontend interacts with the backend stock emulation service, see the [Data Flow](./data-flow.md) documentation. 