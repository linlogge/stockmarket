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

    /// Get historical price candles for a stock.
    /// 
    /// All date parameters are optional. By default the most recent candle is returned if no date parameters are provided.
    ///
    /// # Arguments
    ///
    /// * `symbol` - The symbol of the stock to get the history for.
    /// * `resolution` - The duration of each candle. 
    ///     * Minutely Resolutions: (minutely, 1, 3, 5, 15, 30, 45, ...)
    ///     * Hourly Resolutions: (hourly, H, 1H, 2H, ...)
    ///     * Daily Resolutions: (daily, D, 1D, 2D, ...)
    ///     * Weekly Resolutions: (weekly, W, 1W, 2W, ...)
    ///     * Monthly Resolutions: (monthly, M, 1M, 2M, ...)
    ///     * Yearly Resolutions:(yearly, Y, 1Y, 2Y, ...)
    /// * `from` - The leftmost candle on a chart (inclusive). From and countback are mutually exclusive. If you use countback, from must be omitted. Accepted timestamp inputs: unix.
    /// * `to` - The rightmost candle on a chart (inclusive). Accepted timestamp inputs: unix.
    ///
    pub async fn history(&self, symbol: &str, resolution: &str, from: Option<i64>, to: Option<i64>) -> Result<Vec<History>, EmulationError> {   
        self.price(symbol).await?;

        let now_ts = chrono::Utc::now().timestamp();

        let (interval_sec, default_span): (i64, i64) = match resolution {
            "1D" => (60 * 30, 60 * 60 * 24),              // 30-min candles, span 1 day
            "1W" => (60 * 60 * 4, 60 * 60 * 24 * 7),       // 4-hour candles, span 1 week
            "1M" => (60 * 60 * 24, 60 * 60 * 24 * 30),     // daily candles, span 30 days
            "1Y" => (60 * 60 * 24 * 7, 60 * 60 * 24 * 365), // weekly candles, span 1 year
            "5Y" => (60 * 60 * 24 * 30, 60 * 60 * 24 * 365 * 5), // monthly candles, span 5 years
            _ => (60, 60 * 60 * 24), // fallback 1-min interval & 1 day span
        };

        let to_ts = to.unwrap_or(now_ts);
        let from_ts = from.unwrap_or(to_ts - default_span);

        if let Some(mut hist_ref) = self.history.get_mut(symbol) {
            hist_ref.sort_by_key(|h| h.timestamp);

            if let Some(first_ts) = hist_ref.first().map(|h| h.timestamp) {
                if from_ts < first_ts {
                    let mut rng = rand::thread_rng();
                    let mut current_ts = first_ts - interval_sec;
                    let mut current_price = hist_ref.first().unwrap().open;

                    while current_ts >= from_ts {
                        let change_pct: f64 = rng.gen_range(-0.003..0.003);
                        let new_price = (current_price * (1.0 - change_pct)).max(0.01);

                        hist_ref.insert(0, History {
                            open: new_price,
                            high: new_price.max(current_price),
                            low: new_price.min(current_price),
                            close: current_price,
                            volume: rng.gen_range(500..5_000),
                            timestamp: current_ts,
                        });

                        current_price = new_price;
                        current_ts -= interval_sec;
                    }
                }
            }

            let window: Vec<History> = hist_ref
                .iter()
                .filter(|h| h.timestamp >= from_ts && h.timestamp <= to_ts)
                .cloned()
                .collect();

            if interval_sec <= 60 {
                return Ok(window);
            }

            let mut buckets: Vec<History> = Vec::new();
            let mut current_bucket_start = None::<i64>;
            let mut open = 0.0;
            let mut high = f64::MIN;
            let mut low = f64::MAX;
            let mut volume: u64 = 0;

            for candle in window.iter() {
                let bucket_start = (candle.timestamp / interval_sec) * interval_sec;
                if current_bucket_start.is_none() || current_bucket_start.unwrap() != bucket_start {
                    if let Some(start) = current_bucket_start {
                        buckets.push(History {
                            open,
                            high,
                            low,
                            close: window.iter().rev().find(|c| (c.timestamp / interval_sec) * interval_sec == start).unwrap().close,
                            volume,
                            timestamp: start,
                        });
                    }

                    current_bucket_start = Some(bucket_start);
                    open = candle.open;
                    high = candle.high;
                    low = candle.low;
                    volume = candle.volume;
                } else {
                    high = high.max(candle.high);
                    low = low.min(candle.low);
                    volume += candle.volume;
                }
            }

            if let Some(start) = current_bucket_start {
                buckets.push(History {
                    open,
                    high,
                    low,
                    close: window.last().unwrap().close,
                    volume,
                    timestamp: start,
                });
            }

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
