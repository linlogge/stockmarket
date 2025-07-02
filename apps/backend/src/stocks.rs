use crate::models::Stock;
use axum::{extract::{ConnectInfo, Query}, http::HeaderMap, Json};
use once_cell::sync::Lazy;
use reqwest;
use std::net::SocketAddr;

static STOCKS: Lazy<Vec<Stock>> = Lazy::new(|| {
    let stocks_json = include_str!("stocks.json");
    serde_json::from_str(stocks_json).expect("Failed to parse stocks.json")
});

const AVAILABLE_COUNTRIES: &[&str] = &["US", "DE"];

#[derive(serde::Deserialize)]
struct IpApiResponse {
    #[serde(rename = "countryCode")]
    country_code: String,
    status: String,
}

async fn get_country_from_ip(ip: &str) -> Option<String> {
    let url = if ip.starts_with("127.0.0.1") || ip.starts_with("::1") {
        "http://ip-api.com/json/".to_string()
    } else {
        format!("http://ip-api.com/json/{}", ip)
    };

    let response = reqwest::get(&url).await.ok()?;
    let data = response.json::<IpApiResponse>().await.ok()?;
    if data.status == "success" {
        Some(data.country_code)
    } else {
        None
    }
}

#[derive(serde::Deserialize, Debug)]
pub struct AvailableStocksQuery {
    country: Option<String>,
}

pub async fn available_stocks_handler(
    headers: HeaderMap,
    Query(query): Query<AvailableStocksQuery>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> Json<Vec<Stock>> {
    let ip = headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .and_then(|s| s.split(',').next())
        .map(|s| s.trim().to_string())
        .unwrap_or_else(|| addr.ip().to_string());

    let country_code;

    if let Some(country ) = query.country {
        country_code = if AVAILABLE_COUNTRIES.contains(&country.as_str()) {
            country
        } else {
            "US".to_string()
        };
    } else {
        country_code = get_country_from_ip(&ip)
            .await
            .filter(|country| AVAILABLE_COUNTRIES.contains(&country.as_str()))
            .unwrap_or_else(|| "US".to_string());
    }

    let stocks = STOCKS
        .iter()
        .filter(|stock| stock.country == country_code)
        .cloned()
        .collect();

    Json(stocks)
}

pub async fn get_country_code_handler(
    headers: HeaderMap,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> Json<String> {
    let ip = headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .and_then(|s| s.split(',').next())
        .map(|s| s.trim().to_string())
        .unwrap_or_else(|| addr.ip().to_string());

    let country_code = get_country_from_ip(&ip)
        .await
        .filter(|country| AVAILABLE_COUNTRIES.contains(&country.as_str()))
        .unwrap_or_else(|| "US".to_string());

    Json(country_code)
}
