use crate::models::Stock;
use anyhow::Context;
use serde::{Deserialize, Serialize};
use thiserror::Error;
use chrono::Utc;
use dashmap::DashMap;
use rand::Rng;
use std::sync::Arc;
use tokio::{task, time::{self, Duration}};

#[derive(Error, Debug)]
pub enum EmulationError {
    #[error("stock not found: {0}")]
    StockNotFound(String),
    #[error("internal error: {0}")]
    Internal(#[from] anyhow::Error),
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct History {
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: u64,
    pub timestamp: i64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct PriceInfo {
    pub symbol: String,
    pub mid: f64,
}

#[derive(Clone)]
pub struct StockEmulator {
    stocks: Vec<Stock>,
    history: Arc<DashMap<String, Vec<History>>>,
    current_price: Arc<DashMap<String, f64>>, 
}

impl StockEmulator {
    pub fn new() -> anyhow::Result<Self> {
        let stocks_json = include_str!("stocks.json");
        let stocks: Vec<Stock> =
            serde_json::from_str(stocks_json).context("failed to parse stocks.json")?;

        Ok(Self {
            stocks,
            history: Arc::new(DashMap::new()),
            current_price: Arc::new(DashMap::new()),
        })
    }

    pub fn stocks(&self, _locale: &str) -> Vec<Stock> {
        self.stocks.to_vec()
    }

    pub async fn price(&self, symbol: &str) -> Result<PriceInfo, EmulationError> {
        if !self.stocks.iter().any(|s| s.symbol == symbol) {
            return Err(EmulationError::StockNotFound(symbol.to_string()));
        }

        if self.current_price.get(symbol).is_none() {
            let mut rng = rand::thread_rng();
            let initial_price: f64 = rng.gen_range(10.0..500.0);

            self.current_price.insert(symbol.to_string(), initial_price);

            let first_tick = History {
                open: initial_price,
                high: initial_price,
                low: initial_price,
                close: initial_price,
                volume: rng.gen_range(1000..10_000),
                timestamp: Utc::now().timestamp(),
            };
            self.history.insert(symbol.to_string(), vec![first_tick]);

            self.spawn_price_stream(symbol.to_string());
        }

        let price = *self.current_price.get(symbol).unwrap();
        Ok(PriceInfo {
            symbol: symbol.to_string(),
            mid: price,
        })
    }

    pub async fn history(
        &self,
        symbol: &str,
        resolution: &str,
        from: Option<i64>,
        to: Option<i64>,
    ) -> Result<Vec<History>, EmulationError> {
        self.price(symbol).await?;
    
        let now_ts = Utc::now().timestamp();
    
        let (interval_sec, default_span) = match resolution {
            "1D" => (60 * 30, 60 * 60 * 24),
            "1M" => (60 * 60 * 24, 60 * 60 * 24 * 30),
            "3M" => (60 * 60 * 24 * 7, 60 * 60 * 24 * 90),
            "1Y" => (60 * 60 * 24 * 30, 60 * 60 * 24 * 365),
            _ => (60, 60 * 60 * 24),
        };
    
        let to_ts = to.unwrap_or(now_ts);
        let from_ts = from.unwrap_or(to_ts - default_span);
    
        let mut backfilled_candles = Vec::new();
        if let Some(hist_ref) = self.history.get(symbol) {
            if let Some(first_candle) = hist_ref.first() {
                if from_ts < first_candle.timestamp {
                    let mut rng = rand::thread_rng();
                    let backfill_step_sec = 60;
                    let mut current_ts = first_candle.timestamp - backfill_step_sec;
                    let mut current_price = first_candle.open;
    
                    while current_ts >= from_ts {
                        let change_pct: f64 = rng.gen_range(-0.003..0.003);
                        let new_price = (current_price * (1.0 - change_pct)).max(0.01);
                        backfilled_candles.push(History {
                            open: new_price,
                            high: new_price.max(current_price),
                            low: new_price.min(current_price),
                            close: current_price,
                            volume: rng.gen_range(500..5_000),
                            timestamp: current_ts,
                        });
                        current_price = new_price;
                        current_ts -= backfill_step_sec;
                    }
                }
            }
        }
    
        if let Some(mut hist_ref) = self.history.get_mut(symbol) {
            if !backfilled_candles.is_empty() {
                backfilled_candles.reverse();
                hist_ref.splice(0..0, backfilled_candles);
            }
    
            let window: Vec<History> = hist_ref
                .iter()
                .filter(|h| h.timestamp >= from_ts && h.timestamp <= to_ts)
                .cloned()
                .collect();
    
            if window.is_empty() || interval_sec <= 60 {
                return Ok(window);
            }
    
            let mut buckets = Vec::new();
            let mut current_bucket_start = (window[0].timestamp / interval_sec) * interval_sec;
            let mut open = window[0].open;
            let mut high = window[0].high;
            let mut low = window[0].low;
            let mut close = window[0].close;
            let mut volume = window[0].volume;
    
            for candle in window.iter().skip(1) {
                let bucket_start = (candle.timestamp / interval_sec) * interval_sec;
                if bucket_start != current_bucket_start {
                    buckets.push(History {
                        open,
                        high,
                        low,
                        close,
                        volume,
                        timestamp: current_bucket_start,
                    });
                    current_bucket_start = bucket_start;
                    open = candle.open;
                    high = candle.high;
                    low = candle.low;
                    close = candle.close;
                    volume = candle.volume;
                } else {
                    high = high.max(candle.high);
                    low = low.min(candle.low);
                    volume += candle.volume;
                    close = candle.close;
                }
            }
            buckets.push(History {
                open,
                high,
                low,
                close,
                volume,
                timestamp: current_bucket_start,
            });
    
            Ok(buckets)
        } else {
            Ok(vec![])
        }
    }

    fn spawn_price_stream(&self, symbol: String) {
        let price_map = Arc::clone(&self.current_price);
        let history_map = Arc::clone(&self.history);

        task::spawn(async move {
            let mut interval = time::interval(Duration::from_secs(1));
            loop {
                interval.tick().await;

                if let Some(price_entry) = price_map.get(&symbol) {
                    let last_price = *price_entry;
                    drop(price_entry);

                    let change_pct: f64 = rand::thread_rng().gen_range(-0.005..0.005);
                    let mut new_price = last_price * (1.0 + change_pct);
                    if new_price < 0.01 {
                        new_price = 0.01;
                    }

                    price_map.insert(symbol.clone(), new_price);

                    let ts = Utc::now().timestamp();
                    let volume: u64 = rand::thread_rng().gen_range(500..5_000);
                    let history_entry = History {
                        open: last_price,
                        high: new_price.max(last_price),
                        low: new_price.min(last_price),
                        close: new_price,
                        volume,
                        timestamp: ts,
                    };

                    if let Some(mut vec_ref) = history_map.get_mut(&symbol) {
                        vec_ref.push(history_entry);
                    }
                } else {
                    break;
                }
            }
        });
    }
}
