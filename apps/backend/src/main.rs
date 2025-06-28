use axum::{routing::get, Json, Router};
use serde::Serialize;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new().allow_origin(Any);

    let app = Router::new()
        .route("/api/portfolio/history", get(portfolio_history))
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

#[derive(Serialize)]
struct PortfolioHistory {
    labels: Vec<String>,
    data: Vec<f64>,
}
