use axum::{routing::{get, post}, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new().allow_origin(Any);

    let app = Router::new()
        .route("/api/portfolio/history", get(portfolio_history))
        .route("/api/trade", post(handle_trade))
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn portfolio_history() -> Json<PortfolioHistory> {
    let history = PortfolioHistory {
        labels: vec![
            "Mon".to_string(),
            "Tue".to_string(),
            "Wed".to_string(),
            "Thu".to_string(),
            "Fri".to_string(),
            "Sat".to_string(),
            "Sun".to_string(),
        ],
        data: vec![
            124160.76, 124500.50, 124800.90, 124650.20, 125120.34, 125300.10, 125364.21,
        ],
    };
    Json(history)
}

async fn handle_trade(Json(payload): Json<Trade>) -> Json<TradeResponse> {
    println!("Received trade: {:?}", payload);
    // In a real app, you would process the trade here
    let response = TradeResponse {
        message: format!("Trade for {} {} {} successful!", payload.action, payload.quantity, payload.symbol),
    };
    Json(response)
}

#[derive(Serialize)]
struct PortfolioHistory {
    labels: Vec<String>,
    data: Vec<f64>,
}

#[derive(Deserialize, Debug)]
struct Trade {
    symbol: String,
    quantity: u32,
    action: String,
}

#[derive(Serialize)]
struct TradeResponse {
    message: String,
}
