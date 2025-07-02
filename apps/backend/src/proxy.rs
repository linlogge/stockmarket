use crate::error::AppError;
use axum::{
    body::{self, Body},
    extract::Path,
    http::{HeaderValue, Request, Response, Uri},
};
use reqwest::Client;
use tracing::debug;

const MARKETDATA_API_URL: &str = "https://api.marketdata.app";

pub async fn proxy_handler(
    Path(path): Path<String>,
    req: Request<Body>,
) -> Result<Response<Body>, AppError> {
    let client = Client::new();

    let query = req.uri().query().unwrap_or("");
    let target_url_str = if query.is_empty() {
        format!("{}/v1/{}", MARKETDATA_API_URL, path)
    } else {
        format!("{}/v1/{}?{}", MARKETDATA_API_URL, path, query)
    };

    debug!("target_url_str: {}", target_url_str);

    let target_url = target_url_str
        .parse::<Uri>()
        .map_err(|_| AppError::InternalServerError)?;

    let method = req.method().clone();
    let mut headers = req.headers().clone();
    let body_bytes = body::to_bytes(req.into_body(), usize::MAX)
        .await
        .map_err(|_| AppError::InternalServerError)?;

    headers.remove("host");

    if let Ok(api_key) = std::env::var("MARKETDATA_API_KEY") {
        if let Ok(header_value) = HeaderValue::from_str(&format!("Bearer {}", api_key)) {
            headers.insert("Authorization", header_value);
        }
    }

    let proxy_req = client
        .request(method, target_url.to_string())
        .headers(headers)
        .body(body_bytes)
        .build()
        .map_err(|_| AppError::InternalServerError)?;

    let proxy_res = client
        .execute(proxy_req)
        .await
        .map_err(|e| AppError::ExternalApiError(e.to_string()))?;

    let mut res_builder = Response::builder().status(proxy_res.status());
    for (name, value) in proxy_res.headers() {
        res_builder = res_builder.header(name, value);
    }

    let response = res_builder
        .body(Body::from_stream(proxy_res.bytes_stream()))
        .map_err(|_| AppError::InternalServerError)?;

    Ok(response)
} 