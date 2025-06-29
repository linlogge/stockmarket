# Routing

The frontend uses a simple, custom-built client-side router located in `router.ts`. This router allows for navigation between different views without requiring a full page refresh, which is the core principle of a Single-Page Application (SPA).

## Core Concepts

### 1. View Interface

The router expects each view function to return a `View` object:

```typescript
interface View {
    element: HTMLElement;
    cleanup?: () => void;
}
```

-   **`element`**: The main HTML element that represents the view.
-   **`cleanup`**: An optional function that is executed when the user navigates away from the view. This is crucial for resource management, such as clearing polling intervals (as seen in the `dashboardView`).

### 2. Route Registration

In `main.ts`, routes are registered with the router instance using the `addRoute` method.

```typescript
router
    .addRoute('/', landingView)
    .addRoute('/dashboard', dashboardView, true) // Protected
    .addRoute('/trade', tradeView, true)       // Protected
    .addRoute('/login', loginView)
    .addRoute('/settings', settingsView, true); // Protected
```

The `addRoute` method takes three arguments:
1.  `path`: The URL path for the route.
2.  `view`: The view function to execute for this route.
3.  `isProtected` (optional): A boolean flag. If `true`, the router will ensure the user is authenticated before rendering the view.

### 3. Protected Routes

The router includes a simple guard for protected routes. Before rendering a view, it checks two conditions:
1.  Is the route marked as protected?
2.  Is the user currently logged in (checked via `authService.isLoggedIn()`)?

If a route is protected and the user is not authenticated, the router automatically redirects them to the `/login` page using `router.navigate('/login')`. This prevents unauthenticated access to sensitive views like the dashboard and settings pages.

### 4. Navigation

Programmatic navigation is handled by the `router.navigate(path)` method. This is used, for example, after a successful login to redirect the user to the dashboard.

User-driven navigation (i.e., clicking links) is handled by a global click listener within the router. It intercepts clicks on any `<a>` tag that has the `data-link` attribute, preventing the browser's default navigation and instead calling `router.navigate()` with the link's `href`. 