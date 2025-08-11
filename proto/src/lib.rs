use protox::prost::Message;
use tonic_build::FileDescriptorSet;

/// Returns the Protobuf file descriptor for the RPC API.
pub fn rpc_api_descriptor() -> FileDescriptorSet {
    let bytes = include_bytes!(concat!(env!("OUT_DIR"), "/", "rpc_file_descriptor.bin"));
    FileDescriptorSet::decode(&bytes[..])
        .expect("bytes should be a valid file descriptor created by build.rs")
}

/// Returns the Protobuf file descriptor for the remote prover API.
pub fn remote_prover_api_descriptor() -> FileDescriptorSet {
    let bytes = include_bytes!(concat!(env!("OUT_DIR"), "/", "remote_prover_file_descriptor.bin"));
    FileDescriptorSet::decode(&bytes[..])
        .expect("bytes should be a valid file descriptor created by build.rs")
}

/// Returns the Protobuf file descriptor for the store RPC API.
#[cfg(feature = "internal")]
pub fn store_rpc_api_descriptor() -> FileDescriptorSet {
    let bytes = include_bytes!(concat!(env!("OUT_DIR"), "/", "store_rpc_file_descriptor.bin"));
    FileDescriptorSet::decode(&bytes[..])
        .expect("bytes should be a valid file descriptor created by build.rs")
}

/// Returns the Protobuf file descriptor for the store NTX builder API.
#[cfg(feature = "internal")]
pub fn store_ntx_builder_api_descriptor() -> FileDescriptorSet {
    let bytes =
        include_bytes!(concat!(env!("OUT_DIR"), "/", "store_ntx_builder_file_descriptor.bin"));
    FileDescriptorSet::decode(&bytes[..])
        .expect("bytes should be a valid file descriptor created by build.rs")
}

/// Returns the Protobuf file descriptor for the store block producer API.
#[cfg(feature = "internal")]
pub fn store_block_producer_api_descriptor() -> FileDescriptorSet {
    let bytes =
        include_bytes!(concat!(env!("OUT_DIR"), "/", "store_block_producer_file_descriptor.bin"));
    FileDescriptorSet::decode(&bytes[..])
        .expect("bytes should be a valid file descriptor created by build.rs")
}

/// Returns the Protobuf file descriptor for the store shared API.
#[cfg(feature = "internal")]
pub fn store_shared_api_descriptor() -> FileDescriptorSet {
    let bytes = include_bytes!(concat!(env!("OUT_DIR"), "/", "store_shared_file_descriptor.bin"));
    FileDescriptorSet::decode(&bytes[..])
        .expect("bytes should be a valid file descriptor created by build.rs")
}

/// Returns the Protobuf file descriptor for the block-producer API.
#[cfg(feature = "internal")]
pub fn block_producer_api_descriptor() -> FileDescriptorSet {
    let bytes = include_bytes!(concat!(env!("OUT_DIR"), "/", "block_producer_file_descriptor.bin"));
    FileDescriptorSet::decode(&bytes[..])
        .expect("bytes should be a valid file descriptor created by build.rs")
}
