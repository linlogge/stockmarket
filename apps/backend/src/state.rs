//! Application state 

use crate::{models::User, emulate::StockEmulator};
use dashmap::DashMap;
use secrecy::Secret;
use std::sync::Arc;
use uuid::Uuid;
use lazy_static::lazy_static;

#[derive(Clone)]
pub struct AppState {
    pub user_store: Arc<DashMap<String, User>>,
    pub emulator: StockEmulator,
}

lazy_static! {
    pub static ref JWT_SECRET: Secret<String> =
        Secret::new(std::env::var("JWT_SECRET").unwrap_or_else(|_| "supersecret".to_string()));
}

impl AppState {
    pub fn new() -> Self {
        let user_store = Arc::new(DashMap::new());
        let user_id = Uuid::new_v4();
        let password_hash = "password123".to_string();
        let user = User {
            id: user_id,
            email: "test@example.com".to_string(),
            password_hash: Secret::new(password_hash),
        };
        user_store.insert("test@example.com".to_string(), user);

        let emulator = StockEmulator::new().expect("failed to create stock emulator");

        Self { user_store, emulator }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
} 