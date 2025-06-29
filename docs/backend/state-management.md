# Backend State Management

While the backend is largely stateless (especially concerning authentication, which uses JWTs), it does maintain one piece of shared, in-memory state: the transaction history. This is managed using Axum's built-in state management capabilities.

## The `AppState` Struct

The core of the state management is the `AppState` struct, defined in `main.rs`:

```rust
#[derive(Clone)]
struct AppState {
    transactions: Arc<Mutex<Vec<Trade>>>,
}
```

-   **`Arc<T>` (Atomically Reference Counted)**: This is a smart pointer that allows for safe, shared ownership of data across multiple threads. Since Axum handlers can run on different threads, `Arc` ensures that all handlers are referring to the *same* instance of the transaction list.

-   **`Mutex<T>` (Mutual Exclusion)**: This provides a locking mechanism to ensure that only one thread can modify the transaction list at a time. This prevents race conditions where two trades might try to write to the `Vec<Trade>` simultaneously, which would lead to data corruption. The `parking_lot::Mutex` is used as it is known for being smaller and faster than the one in the standard library.

## Initializing and Sharing State

An instance of `AppState` is created once when the server starts in the `main` function. This instance is then passed to the Axum `Router` using the `.with_state()` method:

```rust
// In main()
let app_state = AppState {
    transactions: Arc::new(Mutex::new(vec![])),
};

let app = Router::new()
    // ... routes
    .with_state(app_state);
```

This makes the `AppState` available to all route handlers.

## Accessing State in Handlers

Handlers that need to access or modify the state do so by using the `State` extractor as one of their arguments:

```rust
#[axum::debug_handler]
async fn handle_trade(
    State(state): State<AppState>, // <-- Extracts the shared state
    Json(payload): Json<Trade>,
) -> Json<TradeResponse> {
    // Lock the mutex to get exclusive access and push the new trade
    state.transactions.lock().push(payload.clone());
    // ...
}

#[axum::debug_handler]
async fn get_transactions(
    State(state): State<AppState> // <-- Extracts the shared state
) -> Json<Vec<Trade>> {
    // Lock the mutex to get read access and clone the data
    let transactions = state.transactions.lock().clone();
    Json(transactions)
}
```

By using this pattern, the backend can safely manage shared data in a concurrent environment, ensuring that the transaction history is consistent and correct. 