import { Module } from "@nestjs/common";
import { MidenModule } from "./miden/miden.module";
import { MidenController } from "./miden/miden.controller";

@Module({
  imports: [MidenModule],
  controllers: [MidenController],
})
export class AppModule {}
