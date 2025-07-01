//! Application data models 

use serde::{Deserialize, Serialize};
use secrecy::Secret;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: Secret<String>,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: Secret<String>,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub sub: String, // subject (user_id)
    pub exp: usize,  // expiration time
} 