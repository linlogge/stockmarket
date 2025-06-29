use axum::{
    extract::{Path, State},
    routing::{get, post},
    Json, Router,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use parking_lot::Mutex;
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

const JWT_SECRET: &[u8] = b"secret";

#[derive(Clone)]
struct AppState {
    transactions: Arc<Mutex<Vec<Trade>>>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "stockmarket_backend=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let initial_transactions = vec![
        Trade {
            symbol: "AAPL".to_string(),
            quantity: 10,
            action: "buy".to_string(),
        },
        Trade {
            symbol: "GOOGL".to_string(),
            quantity: 5,
            action: "buy".to_string(),
        },
        Trade {
            symbol: "MSFT".to_string(),
            quantity: 20,
            action: "buy".to_string(),
        },
    ];

    let app_state = AppState {
        transactions: Arc::new(Mutex::new(initial_transactions)),
    };

    let cors = CorsLayer::new().allow_origin(Any);

    let app = Router::new()
        .route("/api/login", post(login))
        .route("/api/logout", post(logout))
        .route("/api/portfolio/history", get(portfolio_history))
        .route("/api/portfolio/positions", get(get_portfolio_positions))
        .route("/api/trade", post(handle_trade))
        .route("/api/transactions", get(get_transactions))
        .route("/api/stocks", get(get_available_stocks))
        .route("/api/stocks/:symbol/price", get(get_stock_price))
        .route("/api/portfolio/summary", get(get_portfolio_summary))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::info!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn calculate_current_positions(state: &AppState) -> Vec<Position> {
    let transactions = state.transactions.lock();
    let mut positions_map = std::collections::HashMap::new();

    for trade in transactions.iter() {
        let entry = positions_map.entry(trade.symbol.clone()).or_insert(0i64);
        if trade.action == "buy" {
            *entry += trade.quantity as i64;
        } else {
            *entry -= trade.quantity as i64;
        }
    }

    let all_stocks = get_all_stocks_data();
    let mut positions: Vec<Position> = Vec::new();
    let mut rng = rand::thread_rng();

    for (symbol, shares) in positions_map.into_iter().filter(|&(_, shares)| shares > 0) {
        if let Some(stock_info) = all_stocks.iter().find(|s| s.symbol == symbol) {
            let base_price = match symbol.as_str() {
                "AAPL" => 162.0,
                "GOOGL" => 125.0,
                "MSFT" => 395.0,
                "TSLA" => 168.0,
                "AMZN" => 170.0,
                _ => 100.0,
            };

            let price: f64 = base_price + rng.gen_range(-5.0..5.0);
            let change: f64 = rng.gen_range(-2.0..2.0);
            let change_percent = if price.abs() > 0.0 { (change / price) * 100.0 } else { 0.0 };
            let value = price * shares as f64;
            let previous_day_value = value - (change * shares as f64);

            positions.push(Position {
                symbol: symbol.clone(),
                company: stock_info.company.clone(),
                shares: shares as u32,
                price,
                change,
                change_percent,
                value,
                previous_day_value,
            });
        }
    }
    positions
}

async fn login(Json(payload): Json<LoginPayload>) -> Result<Json<LoginResponse>, axum::http::StatusCode> {
    if payload.email == "test@example.com" && payload.password == "password" {
        let claims = Claims {
            sub: payload.email,
            exp: (Utc::now() + Duration::hours(1)).timestamp() as usize,
        };

        let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(JWT_SECRET))
            .map_err(|e| {
                tracing::error!("Failed to create token: {}", e);
                axum::http::StatusCode::INTERNAL_SERVER_ERROR
            })?;

        Ok(Json(LoginResponse { token }))
    } else {
        Err(axum::http::StatusCode::UNAUTHORIZED)
    }
}

async fn logout() -> axum::http::StatusCode {
    axum::http::StatusCode::OK
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

async fn get_portfolio_summary(State(state): State<AppState>) -> Json<PortfolioSummary> {
    let positions = calculate_current_positions(&state);

    let portfolio_value: f64 = positions.iter().map(|p| p.value).sum();
    let total_previous_day_value: f64 = positions.iter().map(|p| p.previous_day_value).sum();
    let days_gain = portfolio_value - total_previous_day_value;
    
    let days_gain_percent = if total_previous_day_value.abs() > 1e-9 {
        (days_gain / total_previous_day_value)
    } else {
        0.0
    };

    let summary = PortfolioSummary {
        portfolio_value,
        days_gain,
        days_gain_percent,
    };

    Json(summary)
}

fn get_all_stocks_data() -> Vec<Stock> {
    vec![
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
    ]
}

async fn get_available_stocks() -> Json<Vec<Stock>> {
    Json(get_all_stocks_data())
}

#[axum::debug_handler]
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

#[axum::debug_handler]
async fn handle_trade(
    State(state): State<AppState>,
    Json(payload): Json<Trade>,
) -> Json<TradeResponse> {
    tracing::info!(trade = ?payload, "Received new trade");
    state.transactions.lock().push(payload.clone());
    let response = TradeResponse {
        message: format!(
            "Trade for {} {} {} successful!",
            payload.action, payload.quantity, payload.symbol
        ),
    };
    Json(response)
}

#[axum::debug_handler]
async fn get_transactions(State(state): State<AppState>) -> Json<Vec<Trade>> {
    let transactions = state.transactions.lock().clone();
    Json(transactions)
}

#[axum::debug_handler]
async fn get_portfolio_positions(State(state): State<AppState>) -> Json<Vec<Position>> {
    let positions = calculate_current_positions(&state);
    Json(positions)
}

#[derive(Serialize)]
struct PortfolioHistory {
    labels: Vec<String>,
    data: Vec<f64>,
}

#[derive(Serialize,Deserialize, Debug, Clone)]
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
struct Position {
    symbol: String,
    company: String,
    shares: u32,
    price: f64,
    change: f64,
    change_percent: f64,
    value: f64,
    previous_day_value: f64,
}

#[derive(Serialize, Clone)]
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

#[derive(Deserialize)]
struct LoginPayload {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct LoginResponse {
    token: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}
