use crate::{
    auth::{auth_middleware, login},
    proxy::proxy_handler,
    state::AppState,
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

    Router::new()
        .nest("/api/auth", auth_routes)
        .nest("/api/marketdata", proxy_routes)
        .with_state(state)
} 