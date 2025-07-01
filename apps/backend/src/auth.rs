use crate::{
    error::AppError,
    models::{Claims, LoginRequest, LoginResponse},
    state::{AppState, JWT_SECRET},
};
use axum::{
    body::Body,
    extract::State,
    http::{header, Request},
    middleware::Next,
    response::Response,
    Json,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use secrecy::ExposeSecret;

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, AppError> {
    let user = state
        .user_store
        .get(&payload.email)
        .ok_or_else(|| AppError::AuthError("User not found".to_string()))?
        .clone();

    if user.password_hash.expose_secret() != payload.password.expose_secret() {
        return Err(AppError::AuthError("Invalid credentials".to_string()));
    }

    let now = Utc::now();
    let expires_in = Duration::hours(1);
    let exp = (now + expires_in).timestamp() as usize;

    let claims = Claims {
        sub: user.id.to_string(),
        exp,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(JWT_SECRET.expose_secret().as_ref()),
    )
    .map_err(|_| AppError::InternalServerError)?;

    Ok(Json(LoginResponse { token }))
}

pub async fn auth_middleware(req: Request<Body>, next: Next) -> Result<Response, AppError> {
    let auth_header = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .ok_or_else(|| AppError::AuthError("Missing authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::AuthError("Invalid authorization header format".to_string()))?;

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET.expose_secret().as_ref()),
        &Validation::default(),
    )
    .map_err(|e| AppError::AuthError(format!("Invalid token: {}", e)))?;

    Ok(next.run(req).await)
} 