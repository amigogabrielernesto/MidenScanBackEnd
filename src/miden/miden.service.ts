import { Injectable, OnModuleInit } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { join } from "path";
import { firstValueFrom } from "rxjs";
import {
  TestResult,
  TestCase,
  TestDecodeResponse,
  TestBlockResponse,
  GrpcMethodResult,
  BlockTestResult,
} from "./miden.interfaces";
import { grpcOptions } from "./miden.grpc.options";
@Injectable()
export class MidenService implements OnModuleInit {
  public readonly RUST_SERVICE_URL = "http://127.0.0.1:3030/decode";
  private grpcClient: any;

  constructor(private readonly httpService: HttpService) {}

  // ==================== gRPC METHODS ====================
  async onModuleInit() {
    await this.loadGrpcClient();
  }

  private async loadGrpcClient() {
    try {
      const packageDefinition = protoLoader.loadSync(
        grpcOptions.protoPath,
        grpcOptions.loader
      );

      const rpcProto = grpc.loadPackageDefinition(packageDefinition).rpc;
      const serviceClient = (rpcProto as any).rpc?.Api;

      if (!serviceClient) {
        throw new Error("No se pudo encontrar el servicio Api en el proto");
      }

      this.grpcClient = new serviceClient(
        grpcOptions.url,
        grpcOptions.credentials
      );
      console.log("gRPC client loaded successfully");
    } catch (error) {
      console.error("Failed to load gRPC client:", error);
    }
  }

  async obtenerBloqueRed(blockNumber: number): Promise<any> {
    if (!this.grpcClient) {
      throw new Error("gRPC client not initialized");
    }

    return new Promise((resolve, reject) => {
      // CORRECCIÓN: Usar el método correcto "GetBlockByNumber"
      if (typeof this.grpcClient.GetBlockByNumber === "function") {
        this.grpcClient.GetBlockByNumber(
          { block_number: blockNumber }, // Según blockchain.BlockNumber en el proto
          (error: any, response: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      } else {
        reject(
          new Error("Método GetBlockByNumber no disponible en el cliente gRPC")
        );
      }
    });
  }

  // ==================== RUST SERVICE METHODS ====================
  async testDecode(testData: any): Promise<TestDecodeResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.RUST_SERVICE_URL, testData, {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        })
      );

      return {
        success: true,
        rustServiceResponse: response.data,
        sentData: testData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        sentData: testData,
      };
    }
  }

  async testExamples(): Promise<TestResult[]> {
    const testCases: TestCase[] = [
      {
        name: "Hello World en base64",
        data: "SGVsbG8gV29ybGQ=", // "Hello World"
      },
      {
        name: "Número 600000 en base64",
        data: "NjAwMDAw", // "600000"
      },
      {
        name: "JSON simple en base64",
        data: "eyJibG9ja051bWJlciI6NjAwMDAwfQ==", // {"blockNumber":600000}
      },
      {
        name: "Datos binarios ejemplo",
        data: "AAECAwQFBgcICQ==", // Bytes: 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09
      },
    ];

    const results: TestResult[] = [];

    for (const testCase of testCases) {
      try {
        const response = await firstValueFrom(
          this.httpService.post(
            this.RUST_SERVICE_URL,
            { data: testCase.data },
            {
              headers: { "Content-Type": "application/json" },
              timeout: 3000,
            }
          )
        );

        results.push({
          test: testCase.name,
          success: true,
          response: response.data,
          sentData: testCase.data,
        });
      } catch (error) {
        results.push({
          test: testCase.name,
          success: false,
          error: error.message,
          sentData: testCase.data,
        });
      }
    }

    return results;
  }

  async testBlock(blockNumber: number): Promise<TestBlockResponse> {
    const testData = {
      data: Buffer.from(blockNumber.toString()).toString("base64"),
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.RUST_SERVICE_URL, testData, {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        })
      );

      return {
        success: true,
        blockNumber: blockNumber,
        base64Data: testData.data,
        rustServiceResponse: response.data,
      };
    } catch (error) {
      return {
        success: false,
        blockNumber: blockNumber,
        base64Data: testData.data,
        error: error.message,
      };
    }
  }

  // ==================== INTEGRATED METHODS ====================
  async probarBloqueReal(blockNumber: number): Promise<any> {
    try {
      // 1. Obtener bloque real de la red Miden
      const bloqueReal = await this.obtenerBloqueRed(blockNumber);

      // Según el proto, la respuesta es blockchain.MaybeBlock
      // Puede contener el bloque o estar vacío si no existe
      if (!bloqueReal || !bloqueReal.block) {
        return {
          success: false,
          numero_bloque: blockNumber,
          error: "Bloque no encontrado en la red",
        };
      }

      // 2. Convertir el bloque a base64
      const blockData = Buffer.from(JSON.stringify(bloqueReal.block));
      const blockDataBase64 = blockData.toString("base64");

      // 3. Probar con el servicio Rust
      const resultadoRust = await this.testDecode({
        data: blockDataBase64,
      });

      return {
        success: true,
        numero_bloque: blockNumber,
        datos_grpc: {
          existe: !!bloqueReal.block,
          // Agregar más campos según la estructura del bloque
        },
        prueba_rust: resultadoRust,
        datos_base64: blockDataBase64,
      };
    } catch (error) {
      return {
        success: false,
        numero_bloque: blockNumber,
        error: error.message,
      };
    }
  }

  // Método alternativo para obtener solo el header del bloque
  async obtenerHeaderBloque(blockNumber: number): Promise<any> {
    if (!this.grpcClient) {
      throw new Error("gRPC client not initialized");
    }

    return new Promise((resolve, reject) => {
      // Intentar con GetBlockHeaderByNumber
      if (typeof this.grpcClient.GetBlockHeaderByNumber === "function") {
        this.grpcClient.GetBlockHeaderByNumber(
          { block_number: blockNumber },
          (error: any, response: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      } else {
        reject(new Error("Método GetBlockHeaderByNumber no disponible"));
      }
    });
  }

  // Método alternativo si el servicio se llama diferente
  async tryDifferentGrpcMethods(blockNumber: number): Promise<any> {
    if (!this.grpcClient) {
      throw new Error("gRPC client not initialized");
    }

    const methodsToTry = [
      "GetBlockByNumber",
      "GetBlockHeaderByNumber",
      "getBlockByNumber",
      "getBlockHeaderByNumber",
      "QueryBlock",
      "GetBlock",
    ];

    const results: GrpcMethodResult[] = [];

    for (const method of methodsToTry) {
      if (typeof this.grpcClient[method] === "function") {
        try {
          const result = await new Promise((resolve, reject) => {
            this.grpcClient[method](
              { block_number: blockNumber },
              (error: any, response: any) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(response);
                }
              }
            );
          });

          results.push({
            method,
            success: true,
            result,
          });

          // Si funciona, retornar el primer resultado exitoso
          return {
            success: true,
            workingMethod: method,
            result: result,
          };
        } catch (error) {
          results.push({
            method,
            success: false,
            error: error.message,
          });
        }
      } else {
        results.push({
          method,
          success: false,
          error: "Method not available",
        });
      }
    }

    // Si ningún método funcionó
    throw new Error(
      `No working gRPC method found. Attempted: ${results
        .map((r) => r.method)
        .join(", ")}`
    );
  }

  // También agrega este método para múltiples bloques
  async probarMultiplesBloques(numerosBloques: number[]): Promise<any[]> {
    const resultados: BlockTestResult[] = [];

    for (const numeroBloque of numerosBloques) {
      try {
        const resultado = await this.probarBloqueReal(numeroBloque);
        resultados.push(resultado);
      } catch (error) {
        resultados.push({
          success: false,
          numero_bloque: numeroBloque,
          error: error.message,
        });
      }

      // Pequeña pausa para no saturar la red
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return resultados;
  }
}
