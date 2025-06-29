# Project Structure

The frontend code is organized into a logical and maintainable structure within the `apps/web/src` directory.

```
/apps/web/src
├── components/       # Reusable UI components
│   ├── DashboardHeader.ts
│   ├── LoginForm.ts
│   ├── Navbar.ts
│   ├── PortfolioChart.ts
│   ├── PositionsTable.ts
│   ├── SummaryCard.ts
│   └── TradeForm.ts
│
├── scss/             # Styling and theming
│   └── styles.scss
│
├── services/         # API communication and business logic
│   ├── authService.ts
│   └── stockService.ts
│
├── views/            # Top-level page components
│   ├── dashboard.ts
│   ├── landing.ts
│   ├── login.ts
│   ├── settings.ts
│   └── trade.ts
│
├── main.ts           # Main application entry point
└── router.ts         # Client-side router implementation
```

## Directory Breakdown

-   **`components/`**: This directory contains all the reusable UI components that are assembled to create the application's views. For example, `SummaryCard` is used multiple times on the dashboard, and `TradeForm` is the core of the trade view.

-   **`scss/`**: Contains the main Sass file (`styles.scss`), which imports Bootstrap and custom theme overrides.

-   **`services/`**: This is where the application's business logic and API interactions are handled.
    -   `authService.ts` manages user authentication, including JWT handling and local storage.
    -   `stockService.ts` handles all API calls related to stock data, trading, and portfolio information.

-   **`views/`**: These files represent the main pages of the application (e.g., Dashboard, Trade, Login). They are responsible for composing the layout of a page using various components. Each view returns a `View` object, which includes the rendered `HTMLElement` and an optional `cleanup` function for lifecycle management.

-   **`main.ts`**: The entry point of the application. It initializes the navbar, the router, and registers all the application's routes.

-   **`router.ts`**: The custom client-side router implementation. It listens for navigation events and renders the appropriate view into the main application container. 