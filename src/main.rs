use serde::{Deserialize, Serialize};
use warp::Filter;
use base64::{engine::general_purpose, Engine as _};
use anyhow::Result;

use miden_objects::block::ProvenBlock;
use miden_objects::utils::Deserializable; // 🔑 importa el trait para read_from_bytes


#[derive(Deserialize)]
struct DeserializeRequest {
    block_bytes_b64: String,
}

#[derive(Serialize)]
struct DeserializeResponse {
    success: bool,
    header: Option<String>,
    message: String,
}

#[tokio::main]
async fn main() {
    let route = warp::post()
        .and(warp::path("deserialize"))
        .and(warp::body::json())
        .and_then(handle_deserialize);

    println!("🚀 Rust service running on http://localhost:3030");
    println!("Hola mundo!");
    warp::serve(route).run(([0, 0, 0, 0], 3030)).await;
}

async fn handle_deserialize(req: DeserializeRequest) -> Result<impl warp::Reply, warp::Rejection> {
    let decoded = general_purpose::STANDARD
        .decode(req.block_bytes_b64)
        .map_err(|e| anyhow::anyhow!("Base64 decode error: {}", e));

    match decoded {
        Ok(bytes) => {
            // 👇 probamos con ProvenBlock
            match ProvenBlock::read_from_bytes(&bytes) {
                Ok(block) => {
                    let header = block.header();
                    let response = DeserializeResponse {
                        success: true,
                        header: Some(format!("{:?}", header)),
                        message: "Block deserialized successfully".to_string(),
                    };
                    Ok(warp::reply::json(&response))
                }
                Err(e) => {
                    let response = DeserializeResponse {
                        success: false,
                        header: None,
                        message: format!("Failed to parse ProvenBlock: {}", e),
                    };
                    Ok(warp::reply::json(&response))
                }
            }
        }
        Err(e) => {
            let response = DeserializeResponse {
                success: false,
                header: None,
                message: format!("Error decoding base64: {}", e),
            };
            Ok(warp::reply::json(&response))
        }
    }
}
