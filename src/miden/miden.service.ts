// src/miden-test/miden-test.service.ts
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import {
  TestResult,
  TestCase,
  TestDecodeResponse,
  TestBlockResponse,
} from "./miden.interfaces";

@Injectable()
export class MidenService {
  private readonly RUST_SERVICE_URL = "http://127.0.0.1:3030/decode";

  constructor(private readonly httpService: HttpService) {}

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
}
