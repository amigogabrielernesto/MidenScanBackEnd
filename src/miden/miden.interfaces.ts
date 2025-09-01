// src/miden-test/miden-test.interface.ts

export interface GrpcMethodResult {
  method: string;
  success: boolean;
  result?: any;
  error?: string;
}

export interface FieldElement {
  d0: string | number;
  d1: string | number;
  d2: string | number;
  d3: string | number;
}

export interface BlockHeaderResponse {
  block_header: {
    version: number;
    prev_block_commitment: FieldElement;
    block_num: number;
    chain_commitment: FieldElement;
    account_root: FieldElement;
    nullifier_root: FieldElement;
    note_root: FieldElement;
    tx_commitment: FieldElement;
    proof_commitment: FieldElement;
    tx_kernel_commitment: FieldElement;
    timestamp: number;
  };
}
export interface BlockTestResult {
  success: boolean;
  numero_bloque: number;
  datos_grpc?: any;
  prueba_rust?: any;
  datos_base64?: string;
  error?: string;
}

export interface TestResult {
  test: string;
  success: boolean;
  response?: any;
  error?: string;
  sentData: string;
}

export interface TestCase {
  name: string;
  data: string;
}

export interface TestDecodeResponse {
  success: boolean;
  rustServiceResponse?: any;
  error?: string;
  sentData?: any;
}

export interface TestBlockResponse {
  success: boolean;
  blockNumber: number;
  base64Data: string;
  rustServiceResponse?: any;
  error?: string;
}
