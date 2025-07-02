use crate::{
    auth::{auth_middleware, login},
    emulator_handlers::{get_history, get_price, list_stocks},
    proxy::proxy_handler,
    state::AppState,
    stocks::{available_stocks_handler, get_country_code_handler},
};
use axum::{
    middleware,
    routing::{get, post},
    Router,
};

pub fn create_router(state: AppState) -> Router {
    let auth_routes = Router::new().route("/login", post(login));

    let proxy_routes = Router::new()
        .route("/*path", get(proxy_handler))
        .route_layer(middleware::from_fn(auth_middleware));
    
    let stock_routes = Router::new().route("/", get(available_stocks_handler));

    let emulator_routes = Router::new()
        .route("/", get(list_stocks))
        .route("/:symbol/price", get(get_price))
        .route("/:symbol/history", get(get_history));

    Router::new()
        .nest("/api/auth", auth_routes)
        .nest("/api/marketdata", proxy_routes)
        .nest("/api/stocks", stock_routes)
        .route("/api/country", get(get_country_code_handler))
        .nest("/api/emulate", emulator_routes)
        .with_state(state)
} 