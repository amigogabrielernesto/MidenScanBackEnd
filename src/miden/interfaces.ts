export interface Digest {
  d0: number;
  d1: number;
  d2: number;
  d3: number;
}

export interface GetBlockByNumberResponse {
  block_bytes: Uint8Array;
}
export interface BlockHeader {
  version: number;
  prev_block_commitment: Digest;
  block_num: number;
  chain_commitment: Digest;
  account_root: Digest;
  nullifier_root: Digest;
  note_root: Digest;
  tx_commitment: Digest;
  proof_commitment: Digest;
  tx_kernel_commitment: Digest;
  timestamp: number;
}

export interface DeserializedBlock {
  header: BlockHeader;
  transactionCount: number;
  noteCount: number;
  rawSize: number;
}

export interface MidenBlockHeader {
  version: number;
  prevHash: string;
  timestamp: bigint;
  blockHash: string;
  numTransactions: number;
}

export interface MidenTransaction {
  inputs: MidenNote[];
  outputs: MidenNote[];
  scriptHash?: string;
  signature?: string;
}

export interface MidenNote {
  owner: string;
  amount?: bigint;
  assetId?: string;
  serialNum?: string;
}
