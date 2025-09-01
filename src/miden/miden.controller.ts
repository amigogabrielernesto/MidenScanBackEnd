// src/miden-test/miden-test.controller.ts
import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { MidenService } from "./miden.service";

@Controller("miden")
export class MidenController {
  constructor(private readonly midenTestService: MidenService) {}

  @Post("test-decode")
  async testDecode(@Body() testData: any) {
    return this.midenTestService.testDecode(testData);
  }

  @Get("test-examples")
  async testExamples() {
    const testResults = await this.midenTestService.testExamples();
    return {
      timestamp: new Date().toISOString(),
      rustService: this.midenTestService.RUST_SERVICE_URL,
      testResults: testResults,
    };
  }

  @Get("test-block/:number")
  async testBlock(@Param("number") blockNumber: number) {
    return this.midenTestService.testBlock(blockNumber);
  }

  // Nuevos endpoints para bloques reales
  @Get("bloque-real/:numero")
  async obtenerBloqueReal(@Param("numero") numeroBloque: number) {
    return this.midenTestService.probarBloqueReal(numeroBloque);
  }

  @Get("bloque-header/:numero")
  async obtenerHeaderBloque(@Param("numero") numeroBloque: number) {
    return this.midenTestService.obtenerHeaderBloque(numeroBloque);
  }

  @Get("bloques-reales/:numeros")
  async obtenerBloquesReales(@Param("numeros") numerosBloques: string) {
    const numeros = numerosBloques.split(",").map((n) => parseInt(n.trim()));
    return this.midenTestService.probarMultiplesBloques(numeros);
  }

  // ==================== ENDPOINT DEBUG gRPC ====================
  @Get("debug-grpc/:numero")
  async debugGrpc(@Param("numero") blockNumber: number) {
    try {
      // Agregar el método tryDifferentGrpcMethods al servicio si no existe
      const result = await this.midenTestService.tryDifferentGrpcMethods(
        blockNumber
      );
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== ENDPOINT INFO gRPC ====================
  @Get("grpc-info")
  async getGrpcInfo() {
    return {
      grpcServer: "rpc.testnet.miden.io:443",
      availableMethods: [
        "GetBlockByNumber",
        "GetBlockHeaderByNumber",
        "GetAccountDetails",
        "CheckNullifiers",
        "SubmitProvenTransaction",
        "SyncNotes",
        "SyncState",
        "Status",
      ],
      rustService: this.midenTestService.RUST_SERVICE_URL,
    };
  }

  // ==================== ENDPOINT STATUS ====================
  @Get("status")
  async getStatus() {
    try {
      // Verificar si el cliente gRPC está inicializado
      const grpcReady = !!this.midenTestService["grpcClient"]; // Acceder mediante notación de corchetes

      return {
        success: true,
        grpcReady: grpcReady,
        rustService: this.midenTestService.RUST_SERVICE_URL,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
