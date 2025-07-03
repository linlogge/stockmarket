use crate::{
    emulate::{EmulationError, StockEmulator},
    state::AppState,
};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Json},
};
use serde::Deserialize;

pub async fn get_price(
    State(state): State<AppState>,
    Path(symbol): Path<String>,
) -> impl IntoResponse {
    match state.emulator.price(&symbol).await {
        Ok(price_info) => (StatusCode::OK, Json(price_info)).into_response(),
        Err(EmulationError::StockNotFound(_)) => {
            (StatusCode::NOT_FOUND, "Stock not found").into_response()
        }
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Internal error: {}", e),
        )
            .into_response(),
    }
}

#[derive(Deserialize)]
pub struct HistoryQuery {
    resolution: Option<String>,
    from: Option<i64>,
    to: Option<i64>,
}

pub async fn get_history(
    State(state): State<AppState>,
    Path(symbol): Path<String>,
    Query(params): Query<HistoryQuery>,
) -> impl IntoResponse {
    match state
        .emulator
        .history(&symbol, params.resolution.as_deref().unwrap_or("1D"), params.from, params.to)
        .await
    {
        Ok(history) => (StatusCode::OK, Json(history)).into_response(),
        Err(EmulationError::StockNotFound(_)) => {
            (StatusCode::NOT_FOUND, "Stock not found").into_response()
        }
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Internal error: {}", e),
        )
            .into_response(),
    }
}

#[derive(Deserialize)]
pub struct StocksQuery {
    locale: String,
}

pub async fn list_stocks(
    State(state): State<AppState>,
    Query(params): Query<StocksQuery>,
) -> impl IntoResponse {
    let stocks = state.emulator.stocks(&params.locale);
    (StatusCode::OK, Json(stocks)).into_response()
} 