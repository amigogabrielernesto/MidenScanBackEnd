// miden.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Param,
} from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import axios from "axios";

@Injectable()
@Controller("miden")
@ApiTags("Company-categories")
export class MidenController {
  private readonly RUST_SERVICE_URL = "http://localhost:3030/decode";

  @ApiParam({ name: "id", description: "nro de bloque" })
  @Get(":id")
  async getFormattedBlock(@Param("id") blockNumber: number): Promise<any> {
    try {
      // 1. Convertir el número de bloque al formato que espera Rust
      const requestData = {
        data: this.encodeBlockNumber(blockNumber),
      };

      // 2. Hacer la petición POST al servicio Rust
      const response = await axios.post(this.RUST_SERVICE_URL, requestData, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000, // timeout de 5 segundos
      });

      // 3. Retornar la respuesta formateada
      return {
        success: true,
        blockNumber: blockNumber,
        data: response.data,
      };
    } catch (error) {
      // 4. Manejar errores adecuadamente
      if (error.response?.status === 404) {
        throw new HttpException(
          { success: false, message: "Block not found" },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        {
          success: false,
          message: "Error fetching block data",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private encodeBlockNumber(blockNumber: number): string {
    // Depende de qué formato espera Rust:

    // Opción 1: Número como string en base64
    return Buffer.from(blockNumber.toString()).toString("base64");

    // Opción 2: JSON con el número de bloque
    // return Buffer.from(JSON.stringify({ block: blockNumber })).toString('base64');

    // Opción 3: Formato específico que espera Miden
    // return Buffer.from(`block:${blockNumber}`).toString('base64');
  }
}
