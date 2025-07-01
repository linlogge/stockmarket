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

        let initial_price = 100.0 + rand::thread_rng().gen_range(-10.0..10.0);
        self.prices
            .insert(stock.symbol.clone(), (initial_price, initial_price));

        let prices_clone = self.prices.clone();
        let symbol_clone = stock.symbol.clone();

        tokio::spawn(async move {
            let mut interval = tokio::time::interval(time::Duration::from_secs(1));
            loop {
                interval.tick().await;
                prices_clone
                    .entry(symbol_clone.clone())
                    .and_modify(|(price, _open)| {
                        let change = rand::thread_rng().gen_range(-0.5..0.5);
                        *price = (*price + change).max(1.0);
                    });
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
        let current_price = self.price(symbol).await?.price;
        let mut rng = rand::thread_rng();

        let to_dt = Utc
            .timestamp_opt(to, 0)
            .single()
            .ok_or_else(|| EmulationError::Internal(anyhow::anyhow!("invalid 'to' timestamp")))?;
        let from_dt = Utc
            .timestamp_opt(from, 0)
            .single()
            .ok_or_else(|| EmulationError::Internal(anyhow::anyhow!("invalid 'from' timestamp")))?;

        if from_dt >= to_dt {
            return Ok(vec![]);
        }

        let num_points = 100;
        let total_duration = to_dt - from_dt;
        let step = total_duration / num_points;

        let mut price = current_price;
        let mut history = Vec::with_capacity(num_points as usize + 1);

        let change_per_day = 2.0;
        let change_factor = (step.num_seconds() as f64 / (24.0 * 3600.0)).sqrt();

        for i in 0..=num_points {
            let point_time = to_dt - step * i;

            if i > 0 {
                let change = rng.gen_range(-change_per_day..change_per_day) * change_factor;
                price = (price - change).max(1.0);
            }

            history.push(PricePoint {
                time: point_time.timestamp(),
                price,
            });
        }
        history.reverse();

        Ok(history)
    }
}
