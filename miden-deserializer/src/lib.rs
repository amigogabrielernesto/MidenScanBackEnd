// lib.rs básico sin gRPC
#[cfg(feature = "internal")]
pub mod internal {
    pub fn some_internal_function() {
        // tu código aquí
    }
}

// O simplemente déjalo vacío si no necesitas nada
pub fn dummy() -> bool {
    true
}