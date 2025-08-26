// src/miden/miden-rust.service.ts
import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class MidenRustService {
  private readonly rustServiceUrl = "http://localhost:3030";

  async deserializeBlock(blockBytes: Uint8Array): Promise<any> {
    try {
      // Convertir a base64
      const base64String = Buffer.from(blockBytes).toString("base64");

      const response = await axios.post(`${this.rustServiceUrl}/deserialize`, {
        block_bytes_b64: base64String,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Rust deserialization failed: ${error.message}`);
    }
  }
}
