// src/miden-test/miden-test.module.ts
import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MidenService } from "./miden.service";
import { MidenController } from "./miden.controller";

@Module({
  imports: [HttpModule],
  controllers: [MidenController],
  providers: [MidenService],
  exports: [MidenService],
})
export class MidenTestModule {}
