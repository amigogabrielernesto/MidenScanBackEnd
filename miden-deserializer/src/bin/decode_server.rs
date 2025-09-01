use warp::Filter;
use base64::prelude::*;
use serde::{Deserialize, Serialize};
use thiserror::Error;
#[allow(unused_imports)]  
use miden_objects::block::BlockHeader;
#[allow(unused_imports)]  
use std::convert::TryFrom;
use std::time::SystemTime;

#[derive(Debug, Deserialize)]
struct DecodeRequest {
    data: String,
}

#[derive(Debug, Error)]
enum ApiError {
    #[error("Decoding error: {0}")]
    Decode(String),
}

#[derive(Debug, Serialize)]
struct DecodeResponse {
    result: String,
    block_number: Option<u32>,  // Optional mientras debuggeamos
    block_hash: Option<String>, // Optional mientras debuggeamos
    data_length: usize,         // Para debug
    first_bytes: String,        // Para debug
}

impl warp::reject::Reject for ApiError {}

async fn decode_handler(req: DecodeRequest) -> Result<DecodeResponse, ApiError> {
      // Log de la llamada recibida
    let start_time = SystemTime::now();
    println!("📥 Received decode request at: {:?}", start_time);
    //println!("📊 Request data length: {} characters", req.base64_data.len());
    
    let b64 = req.data;
    let raw = BASE64_STANDARD.decode(&b64)
        .map_err(|e| ApiError::Decode(format!("Base64 decoding failed: {}", e)))?;
    
    // DEBUG: Ver qué datos recibimos
    println!("=== BLOCK DATA ANALYSIS ===");
    println!("Base64 length: {} chars", b64.len());
    println!("Received base64: {}", b64);
    println!("Raw bytes length: {} bytes", raw.len());
    println!("Hex: {}", hex::encode(&raw));
    println!("First 20 bytes: {:?}", &raw[..std::cmp::min(20, raw.len())]);
    
    // TODO: Aquí necesitamos descubrir el formato correcto
    // Mientras tanto, retornamos info de debug
    
    Ok(DecodeResponse {
        result: "Received data, need to implement parsing".to_string(),
        block_number: None,
        block_hash: None,
        data_length: raw.len(),
        first_bytes: format!("{:?}", &raw[..std::cmp::min(10, raw.len())]),
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