use crate::models::Stock;
use axum::{extract::ConnectInfo, http::HeaderMap, Json};
use once_cell::sync::Lazy;
use reqwest;
use std::{collections::HashMap, net::SocketAddr};

static STOCKS_BY_COUNTRY: Lazy<HashMap<String, Vec<Stock>>> = Lazy::new(|| {
    let stocks_json = include_str!("stocks.json");
    serde_json::from_str(stocks_json).expect("Failed to parse stocks.json")
});

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

pub async fn available_stocks_handler(
    headers: HeaderMap,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> Json<Vec<Stock>> {
    let ip = headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .and_then(|s| s.split(',').next())
        .map(|s| s.trim().to_string())
        .unwrap_or_else(|| addr.ip().to_string());

    let country_code = get_country_from_ip(&ip)
        .await
        .unwrap_or_else(|| "US".to_string());

    let stocks = STOCKS_BY_COUNTRY
        .get(&country_code)
        .or_else(|| STOCKS_BY_COUNTRY.get("US"))
        .cloned()
        .unwrap_or_default();

    Json(stocks)
} 