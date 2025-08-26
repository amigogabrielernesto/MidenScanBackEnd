import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom, Observable } from "rxjs";
import { MidenRustService } from "./miden-rust.service";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Logger } from "@nestjs/common";

interface RawBlockResponse {
  block: {
    type: string;
    data: number[];
  };
  _block: string;
}
// Tipado gRPC
interface MaybeBlockResponse {
  block_bytes: Uint8Array;
}

interface BlockchainClient {
  GetBlockByNumber(data: { block_num: number }): Observable<RawBlockResponse>;
}

interface RpcStatusClient {
  Status(request: Empty): Observable<any>;
}

// interface BlockchainClient {
//   GetBlockByNumber(data: { block_num: number }): Observable<MaybeBlockResponse>;
// }

// Función para convertir buffers/arrays a hex
const toHex = (buf: Uint8Array) =>
  Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

@Injectable()
export class MidenService implements OnModuleInit {
  private rpcClient: BlockchainClient;
  private rpcStatusClient: RpcStatusClient;
  private readonly logger = new Logger(MidenService.name);

  constructor(
    @Inject("MidenApiClient")
    private client: ClientGrpc,
    private readonly rustService: MidenRustService
  ) {}

  onModuleInit() {
    this.rpcClient = this.client.getService<BlockchainClient>("Api");
    this.rpcStatusClient = this.client.getService<RpcStatusClient>("Api");
  }

  async getStatus() {
    const response$ = this.rpcStatusClient.Status(new Empty());
    const response = await lastValueFrom(response$);
    return response;
  }

  async getFormattedBlock(blockNumber: number) {
    // 1️⃣ Consultamos status

    const statusResponse = await this.getStatus();
    const chainTip = statusResponse?.store?.chain_tip; // <-- cambiar data.store por solo store
    if (!chainTip) {
      return { success: false, message: "Cannot determine chain tip" };
    }

    // 2️⃣ Chequeo de límites
    if (blockNumber > chainTip) {
      return {
        success: false,
        message: `Block number ${blockNumber} exceeds chain tip ${chainTip}`,
      };
    }

    const blockObservable = this.rpcClient.GetBlockByNumber({
      block_num: blockNumber,
    });
    // 3️⃣ Llamada gRPC para obtener el bloque

    const blockResponse = await lastValueFrom(blockObservable);

    const blockBytes = blockResponse.block
      ? new Uint8Array(blockResponse.block.data)
      : new Uint8Array();

    this.logger.debug(`Block bytes length: ${blockResponse}`);

    if (!blockBytes.length) {
      return { success: false, message: "Block not found or empty" };
    }

    if (!blockBytes.length) {
      return { success: false, message: "Block not found or empty" };
    }

    // Ahora enviás blockBytes a Rust
    const rustResponse = await this.rustService.deserializeBlock(blockBytes);
    // 4️⃣ Deserialización Rust

    if (!rustResponse.success) {
      return { success: false, message: rustResponse.message };
    }

    // 5️⃣ Preparar respuesta en hex
    const headerHex = {
      prev_block_commitment: toHex(rustResponse.header.prev_block_commitment),
      chain_commitment: toHex(rustResponse.header.chain_commitment),
      account_root: toHex(rustResponse.header.account_root),
      nullifier_root: toHex(rustResponse.header.nullifier_root),
      note_root: toHex(rustResponse.header.note_root),
      tx_commitment: toHex(rustResponse.header.tx_commitment),
      proof_commitment: toHex(rustResponse.header.proof_commitment),
      tx_kernel_commitment: toHex(rustResponse.header.tx_kernel_commitment),
      timestamp: rustResponse.header.timestamp,
      block_num: rustResponse.header.block_num,
      version: rustResponse.header.version,
    };

    return {
      success: true,
      header: headerHex,
      message: "Block deserialized successfully",
    };
  }
}
