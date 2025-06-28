# Stockmarket Frontend Programming

## Getting Started

### Prerequisites

- Rust (latest stable)
- Flutter SDK (version ^3.6.0)
- Node.js (LTS version)
- PNPM

### Installation & Setup

1. Clone this repository
2. Navigate to the project root directory

### Flutter Mobile App

To run the mobile app:

1. Open the project in VS Code
2. Select "Run Mobile App (Debug)" from the Run/Debug configurations
3. Press F5 or click the Run button

For release mode:
- Select "Run Mobile App (Release)" configuration instead

### Rust Backend

To run the Rust backend:

1. Start the server in development mode:
   ```sh
   cargo run -p stockmarket-backend
   ```

The backend server will start and listen for incoming connections.

### Web Frontend

To run the web frontend:

1. Install dependencies:
   ```sh
   pnpm install
   ```

2. Start the development server:
   ```sh
   pnpm --filter=stockmarket-web dev
   ```

The web app will be available at http://localhost:3000

