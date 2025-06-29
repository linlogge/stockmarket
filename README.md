# StockMarket Application

This is a full-stack stock market simulation application featuring a modern frontend and a robust backend. It is designed as a monorepo, containing the web app and the API server within the `apps` directory.

## Features

- **Real-time Dashboard**: A dynamic dashboard that polls the backend every second to display live portfolio value and daily gains/losses.
- **Client-Side Routing**: A lightweight, custom-built SPA router with support for protected routes.
- **User Authentication**: JWT-based login system. Authenticated routes are protected, redirecting unauthorized users to a login page.
- **Interactive Trading**: A dedicated view for trading stocks, with a searchable input that fetches and displays live prices.
- **Transaction History**: A persistent, server-side transaction history that updates in real-time on the frontend after a trade is made.
- **Modern UI**: A responsive and clean user interface built with Bootstrap, featuring a sticky header and footer.

## Tech Stack

| Area      | Technology                                    |
|-----------|-----------------------------------------------|
| **Frontend**  | TypeScript, Vite, Bootstrap, SASS, Chart.js   |
| **Backend**   | Rust, Axum, Tokio, Serde, JSON Web Tokens     |

## Project Structure

The project is organized as a monorepo:

```
.
├── apps/
│   ├── backend/  # Rust/Axum backend server
│   └── web/      # TypeScript/Vite frontend SPA
├── docs/
│   ├── backend/
│   └── frontend/ # Detailed technical documentation
```

For detailed technical documentation, please see the `docs` directory.

## Getting Started

### Prerequisites

-   **Rust** (latest stable version)
-   **Node.js** (LTS version)
-   **PNPM** (v10 or later)

### Installation

1.  Clone this repository to your local machine.
2.  Navigate to the project root directory.
3.  Install all dependencies for the monorepo:
    ```sh
    pnpm install
    ```

## Running the Application

You will need to run the backend and frontend in two separate terminals.

### 1. Run the Backend Server

From the project root, run:

```sh
cargo run -p stockmarket-backend
```

The backend server will start and listen on `http://127.0.0.1:3000`.

### 2. Run the Frontend App

From the project root, run:

```sh
pnpm --filter=stockmarket-web dev
```

The web app will be available at `http://localhost:5173` (or the next available port). The Vite server is configured to proxy API requests to the backend.

