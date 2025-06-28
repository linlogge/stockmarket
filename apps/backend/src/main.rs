use axum::{
    extract::Path,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use rand::Rng;

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new().allow_origin(Any);

    let app = Router::new()
        .route("/api/portfolio/history", get(portfolio_history))
        .route("/api/trade", post(handle_trade))
        .route("/api/stocks", get(get_available_stocks))
        .route("/api/stocks/:symbol/price", get(get_stock_price))
        .route("/api/portfolio/summary", get(get_portfolio_summary))
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_stock_price(Path(symbol): Path<String>) -> Json<StockPrice> {
    let mut rng = rand::thread_rng();
    let base_price = match symbol.as_str() {
        "AAPL" => 162.0,
        "GOOGL" => 125.0,
        "MSFT" => 395.0,
        "TSLA" => 168.0,
        "AMZN" => 170.0,
        _ => 100.0,
    };

    let price = base_price + rng.gen_range(-5.0..5.0);

    Json(StockPrice { symbol, price })
}

async fn get_portfolio_summary() -> Json<PortfolioSummary> {
    let mut rng = rand::thread_rng();
    let base_value = 125364.21;
    let value_fluctuation = rng.gen_range(-500.0..500.0);
    let days_gain = rng.gen_range(-550.0..550.0);

    let summary = PortfolioSummary {
        portfolio_value: base_value + value_fluctuation,
        days_gain,
        days_gain_percent: days_gain / base_value,
    };

    Json(summary)
}

async fn get_available_stocks() -> Json<Vec<Stock>> {
    let stocks = vec![
        Stock {
            symbol: "AAPL".to_string(),
            company: "Apple Inc.".to_string(),
        },
        Stock {
            symbol: "GOOGL".to_string(),
            company: "Alphabet Inc.".to_string(),
        },
        Stock {
            symbol: "MSFT".to_string(),
            company: "Microsoft Corp.".to_string(),
        },
        Stock {
            symbol: "TSLA".to_string(),
            company: "Tesla, Inc.".to_string(),
        },
        Stock {
            symbol: "AMZN".to_string(),
            company: "Amazon.com, Inc.".to_string(),
        },
    ];
    Json(stocks)
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

#[derive(Serialize)]
struct Stock {
    symbol: String,
    company: String,
}

#[derive(Serialize)]
struct StockPrice {
    symbol: String,
    price: f64,
}

#[derive(Serialize)]
struct PortfolioSummary {
    portfolio_value: f64,
    days_gain: f64,
    days_gain_percent: f64,
}
