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
      rustService: "http://127.0.0.1:3030/decode",
      testResults: testResults,
    };
  }

  @Get("test-block/:number")
  async testBlock(@Param("number") blockNumber: number) {
    return this.midenTestService.testBlock(blockNumber);
  }
}
