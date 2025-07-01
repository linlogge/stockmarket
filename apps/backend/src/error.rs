//! Application Error and Result types 

use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Authentication failed: {0}")]
    AuthError(String),

    #[error("Not Found: {0}")]
    NotFound(String),

    #[error("Internal Server Error")]
    InternalServerError,

    #[error("Request to external API failed: {0}")]
    ExternalApiError(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::AuthError(msg) => (StatusCode::UNAUTHORIZED, msg),
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            AppError::InternalServerError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal Server Error".to_string(),
            ),
            AppError::ExternalApiError(msg) => (StatusCode::BAD_GATEWAY, msg),
        };

        let body = Json(json!({ "error": error_message }));
        (status, body).into_response()
    }
} 