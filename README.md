# StockMarket Application

This is a full-stack stock market simulation application featuring a web frontend, a Rust backend, and a Flutter mobile app. It is designed as a monorepo, containing all applications within the `apps` directory.

The production Frontend-Web-App can be found at [https://stockmarket.sigmunczyk.de](stockmarket.sigmunczyk.de)

## Features

- **Cross-Platform**: Access the application via a modern web app or a native mobile app for iOS and Android.
- **Real-time Dashboard**: A dynamic dashboard that polls the backend to display live portfolio value, positions, and daily gains/losses.
- **User Authentication**: JWT-based login system. Authenticated routes are protected across all clients.
- **Interactive Trading**: A dedicated view for trading stocks, with a searchable input that fetches and displays live prices.
- **Transaction History**: A persistent, server-side transaction history that updates in real-time.
- **Modern UI**: A responsive and clean user interface built with Bootstrap (web) and Flutter (mobile).

## Tech Stack

| Area      | Technology                                    |
|-----------|-----------------------------------------------|
| **Web**       | TypeScript, Vite, Bootstrap, SASS, Chart.js   |
| **Mobile**    | Flutter, Riverpod, GoRouter, fl_chart         |
| **Backend**   | Rust, Axum, Tokio, Serde, JSON Web Tokens     |

## Project Structure

The project is organized as a monorepo:

```
.
├── apps/
│   ├── backend/  # Rust/Axum backend server
│   ├── mobile/   # Flutter mobile application
│   └── web/      # TypeScript/Vite frontend SPA
├── docs/
│   ├── backend/
│   └── frontend/ # Detailed technical documentation
```

For detailed technical documentation, please see the `docs` directory.

## Getting Started

### Prerequisites

-   **Rust** (latest stable version)
-   **Flutter SDK** (latest stable version)
-   **Node.js** (LTS version)
-   **PNPM** (v10 or later)

### Installation

1.  Clone this repository to your local machine.
2.  Navigate to the project root directory.
3.  Install all dependencies for the monorepo (for the web app):
    ```sh
    pnpm install
    ```
4. Get Flutter dependencies for the mobile app:
    ```sh
    cd apps/mobile && flutter pub get
    ```

## Running the Application

You will need to run the backend server first, and then you can run either the web or mobile app (or all three simultaneously).

### 1. Run the Backend Server

From the project root, run:

```sh
cargo run -p stockmarket
```

The backend server will start and listen on `http://127.0.0.1:3000`.

### 2. Run the Web App

From the project root, run:

```sh
pnpm --filter=stockmarket dev
```

The web app will be available at `http://localhost:5173`.

### 3. Run the Mobile App

1.  Ensure you have a running simulator/emulator or a connected physical device.
2.  From the project root, run:
    ```sh
    cd apps/mobile && flutter run
    ```

The mobile app will launch on your selected device.

