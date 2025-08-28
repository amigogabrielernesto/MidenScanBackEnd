use warp::Filter;
use base64::prelude::*;
use serde::{Deserialize, Serialize};
use thiserror::Error;  // Cambiar anyhow por thiserror para Warp

// Buscar la importación correcta de Block - EJEMPLOS:
// use miden_objects::Block;
// use miden_objects::core::Block;
// use miden_objects::blocks::Block;
// use miden_objects::state::Block;

#[derive(Debug, Deserialize)]
struct DecodeRequest {
    data: String,
}

#[derive(Debug, Serialize)]
struct DecodeResponse {
    result: String,
}

// Definir errores personalizados que implementen Reject
#[derive(Debug, Error)]
enum ApiError {
    #[error("Decoding error: {0}")]
    Decode(String),
}

impl warp::reject::Reject for ApiError {}

async fn decode_handler(req: DecodeRequest) -> Result<DecodeResponse, ApiError> {
    let b64 = req.data;
    let raw = BASE64_STANDARD.decode(&b64)
        .map_err(|e| ApiError::Decode(format!("Base64 decoding failed: {}", e)))?;
    
    // TODO: Usar Block cuando encuentres la importación correcta
    // let block = Block::decode(&raw).map_err(|e| ApiError::Decode(e.to_string()))?;
    
    println!("Decoded {} bytes successfully", raw.len());
    
    Ok(DecodeResponse {
        result: format!("Decoded {} bytes", raw.len()),
    })
}

#[tokio::main]
async fn main() {
    let decode_route = warp::post()
        .and(warp::path("decode"))
        .and(warp::body::json())
        .and_then(|req: DecodeRequest| async move {
            match decode_handler(req).await {
                Ok(res) => Ok(warp::reply::json(&res)),
                Err(e) => Err(warp::reject::custom(e)),
            }
        });

    println!("Server running on http://127.0.0.1:3030");
    warp::serve(decode_route).run(([127, 0, 0, 1], 3030)).await;
}