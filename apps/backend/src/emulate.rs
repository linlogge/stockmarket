use crate::models::Stock;
use anyhow::Context;
use chrono::{Duration, TimeZone, Utc};
use dashmap::DashMap;
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum EmulationError {
    #[error("stock not found: {0}")]
    StockNotFound(String),
    #[error("internal error: {0}")]
    Internal(#[from] anyhow::Error),
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct PricePoint {
    pub time: i64,
    pub price: f64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct PriceInfo {
    pub price: f64,
    pub diff: f64,
}

#[derive(Clone)]
pub struct StockEmulator {
    prices: Arc<DashMap<String, (f64, f64)>>, 
    histories: Arc<DashMap<String, Vec<PricePoint>>>,
    active_emulations: Arc<DashMap<String, ()>>,
    stocks: Arc<Vec<Stock>>,
}

impl StockEmulator {
    pub fn new() -> anyhow::Result<Self> {
        let stocks_json = include_str!("stocks.json");
        let stocks: Vec<Stock> =
            serde_json::from_str(stocks_json).context("failed to parse stocks.json")?;

        Ok(Self {
            prices: Arc::new(DashMap::new()),
            histories: Arc::new(DashMap::new()),
            active_emulations: Arc::new(DashMap::new()),
            stocks: Arc::new(stocks),
        })
    }

    pub fn stocks(&self, _locale: &str) -> Vec<Stock> {
        self.stocks.to_vec()
    }

    pub async fn price(&self, symbol: &str) -> Result<PriceInfo, EmulationError> {
        if let Some(price_data) = self.prices.get(symbol) {
            let (price, open) = *price_data;
            return Ok(PriceInfo {
                price,
                diff: price - open,
            });
        }

        if self.active_emulations.contains_key(symbol) {
            tokio::time::sleep(time::Duration::from_millis(100)).await;
            if let Some(price_data) = self.prices.get(symbol) {
                let (price, open) = *price_data;
                return Ok(PriceInfo {
                    price,
                    diff: price - open,
                });
            }
            return Err(EmulationError::StockNotFound(symbol.to_string()));
        }

        let stock = self
            .stocks
            .iter()
            .find(|s| s.symbol == symbol)
            .ok_or_else(|| EmulationError::StockNotFound(symbol.to_string()))?;

        self.active_emulations.insert(stock.symbol.clone(), ());

        // Generate initial history
        let now = Utc::now();
        let mut price = 100.0 + rand::thread_rng().gen_range(-10.0..10.0);
        let initial_history: Vec<PricePoint> = (0..365)
            .map(|i| {
                let point_time = now - Duration::days(364 - i);
                if i > 0 {
                    let change: f64 = rand::thread_rng().gen_range(-2.0..2.0);
                    price = (price + change).max(1.0);
                }
                PricePoint {
                    time: point_time.timestamp(),
                    price,
                }
            })
            .collect();

        let initial_price = initial_history.last().map_or(100.0, |p| p.price);

        self.histories
            .insert(stock.symbol.clone(), initial_history);
        self.prices
            .insert(stock.symbol.clone(), (initial_price, initial_price));

        let prices_clone = self.prices.clone();
        let histories_clone = self.histories.clone();
        let symbol_clone = stock.symbol.clone();

        tokio::spawn(async move {
            let mut interval = tokio::time::interval(time::Duration::from_secs(1));
            loop {
                interval.tick().await;
                let mut new_price = 0.0;
                prices_clone
                    .entry(symbol_clone.clone())
                    .and_modify(|(price, _open)| {
                        let change = rand::thread_rng().gen_range(-0.5..0.5);
                        *price = (*price + change).max(1.0);
                        new_price = *price;
                    });

                if new_price > 0.0 {
                    histories_clone
                        .entry(symbol_clone.clone())
                        .and_modify(|history| {
                            history.push(PricePoint {
                                time: Utc::now().timestamp(),
                                price: new_price,
                            });
                        });
                }
            }
        });

        Ok(PriceInfo {
            price: initial_price,
            diff: 0.0,
        })
    }

    pub async fn history(
        &self,
        symbol: &str,
        from: i64,
        to: i64,
    ) -> Result<Vec<PricePoint>, EmulationError> {
        self.price(symbol).await?; // Ensure stock is initialized

        let history_entry = self
            .histories
            .get(symbol)
            .ok_or_else(|| EmulationError::StockNotFound(symbol.to_string()))?;

        let history = history_entry.value();

        let result: Vec<PricePoint> = history
            .iter()
            .filter(|p| p.time >= from && p.time <= to)
            .cloned()
            .collect();

        Ok(result)
    }
}
